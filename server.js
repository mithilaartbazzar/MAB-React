import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
// We recommend using the SERVICE_ROLE_KEY here for secure backend operations
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
}
if (!geminiApiKey) {
    console.error("Missing Gemini API credentials in .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenAI({ apiKey: geminiApiKey });

const hashPassword = (pwd) => btoa(`mcs-salt-${pwd}`);

const createSlug = (value) => String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const normalizeProductData = (productData = {}) => {
    const toTagList = (value) => String(value ?? '')
        .split(/[\n,|·]+/)
        .map((item) => item.replace(/\s+/g, ' ').trim())
        .filter(Boolean);

    const customTags = Array.isArray(productData.custom_tags)
        ? productData.custom_tags
        : toTagList(productData.custom_tags || productData.tags || '');

    return {
        ...productData,
        storeName: String(productData.storeName || '').trim(),
        name: String(productData.name || '').trim(),
        product_code: String(productData.product_code || '').trim(),
        key_features: String(productData.key_features || '').trim(),
        compare_price: Number(productData.compare_price ?? productData.original_price ?? productData.mrp ?? 0) || 0,
        custom_tags: customTags.join(' · '),
        visible_to_users: Boolean(productData.visible_to_users),
        price: Number(productData.price ?? 0) || 0,
        stock: Number(productData.stock ?? 0) || 0,
        tags: Array.isArray(productData.tags)
            ? productData.tags.join(', ')
            : String(productData.tags || '').trim(),
    };
};

const resolveProductStoreName = async (sellerId, fallbackStoreName = '') => {
    const trimmedFallback = String(fallbackStoreName || '').trim();
    if (trimmedFallback) return trimmedFallback;
    if (!sellerId) return '';

    const { data, error } = await supabase
        .from('users')
        .select('storeName')
        .eq('id', sellerId)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return String(data?.storeName || '').trim();
};

const logAction = async (action, adminId) => {
    await supabase.from('logs').insert([{
        id: `l-${Math.random().toString(36).substr(2, 9)}`,
        action,
        admin_id: adminId,
        timestamp: new Date().toISOString()
    }]);
};

const isStoreApprovalSchemaError = (errorMessage = '') => /storeName_pending|storeName_change_requested_at/i.test(errorMessage);

const stripStoreApprovalFields = (record = {}) => {
    const nextRecord = { ...record };
    delete nextRecord.storeName_pending;
    delete nextRecord.storeName_change_requested_at;
    return nextRecord;
};

// --- Gemini API Route ---
app.post('/api/gemini', async (req, res) => {
    try {
        const { userPrompt } = req.body;
        const result = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: userPrompt,
            config: {
                systemInstruction: `You are an expert art consultant specializing in Mithila (Maithili) art, 
                also known as Madhubani art. You are deeply knowledgeable about its history, 
                symbolism, traditional techniques, and the cultural heritage of the Mithila region.
                Keep your responses concise but impactful.`
            }
        });
        res.json({ text: result.text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/cloudinary/signature', (req, res) => {
    if (!cloudinaryApiKey || !cloudinaryApiSecret || !cloudinaryCloudName) {
        return res.status(503).json({ error: 'Cloudinary signed upload is not configured on the server.' });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'mithila-products';
    const signatureBase = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto.createHash('sha1').update(`${signatureBase}${cloudinaryApiSecret}`).digest('hex');

    res.json({ apiKey: cloudinaryApiKey, cloudName: cloudinaryCloudName, timestamp, folder, signature });
});

// --- Supabase DB Proxy Route ---
app.post('/api/db', async (req, res) => {
    try {
        const { action, payload } = req.body;
        let result = null;

        if (!action) {
            console.error('DB Service Error: missing action', req.body);
            return res.status(400).json({ error: 'Missing action' });
        }

        switch (action) {
            case 'login': {
                const { username, password } = payload;
                let { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('username', username)
                    .maybeSingle();

                if (!data && !error) {
                    const alt = await supabase
                        .from('users')
                        .select('*')
                        .eq('email', username)
                        .maybeSingle();
                    data = alt.data;
                    error = alt.error;
                }

                if (error) {
                    throw new Error(error.message);
                }

                const matchesPassword = data && (
                    data.password_hash === hashPassword(password) ||
                    data.password === password
                );

                if (!matchesPassword || !data || data.status !== 'active') {
                    result = null;
                } else {
                    result = data;
                }
                break;
            }
            case 'register': {
                const { userData } = payload;
                const plainPassword = userData.password;
                const sanitizedUserData = { ...userData };

                if (sanitizedUserData.role === 'seller') {
                    delete sanitizedUserData.storeName;
                    delete sanitizedUserData.storeName_pending;
                }

                const newUser = {
                    id: `u-${Math.random().toString(36).substr(2, 9)}`,
                    role: sanitizedUserData.role || 'customer',
                    status: sanitizedUserData.role === 'seller' ? 'disabled' : 'active',
                    storeName: sanitizedUserData.role === 'seller' ? '' : (sanitizedUserData.storeName || ''),
                    storeName_pending: '',
                    ...sanitizedUserData,
                    password: plainPassword,
                    password_hash: hashPassword(plainPassword)
                };
                try {
                    const { data, error } = await supabase.from('users').insert([newUser]).select();
                    if (error) throw new Error(error.message);
                    result = (data && data.length > 0) ? data[0] : newUser;
                } catch (error) {
                    if (!isStoreApprovalSchemaError(error.message)) throw error;
                    const fallbackUser = stripStoreApprovalFields(newUser);
                    const { data, fallbackError } = await supabase.from('users').insert([fallbackUser]).select();
                    if (fallbackError) throw new Error(fallbackError.message);
                    result = (data && data.length > 0) ? data[0] : fallbackUser;
                }
                break;
            }
            case 'getUserByEmail': {
                const { email } = payload;
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .maybeSingle(); // maybeSingle instead of single so it doesn't throw if not found
                
                if (error) throw new Error(error.message);
                if (!data || data.status !== 'active') result = null;
                else result = data;
                break;
            }
            case 'registerGoogleUser': {
                const { picture, ...restUserData } = payload.userData;
                const newUser = {
                    id: `u-${Math.random().toString(36).substr(2, 9)}`,
                    role: 'customer',
                    status: 'active',
                    avatar_url: picture,
                    ...restUserData
                };
                const { data, error } = await supabase.from('users').insert([newUser]).select();
                if (error) throw new Error(error.message);
                
                result = (data && data.length > 0) ? data[0] : newUser;
                break;
            }
            case 'getUsers': {
                const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
                if (error) throw new Error(error.message);
                result = data;
                break;
            }
            case 'updateUser': {
                const { userId, userData } = payload;
                const currentUserQuery = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
                if (currentUserQuery.error) throw new Error(currentUserQuery.error.message);

                const currentUser = currentUserQuery.data;
                let updateData = { ...userData };

                if (currentUser && currentUser.role === 'seller' && updateData.storeName !== undefined) {
                    const approvedStore = String(currentUser.storeName || '').trim();
                    const pendingStore = String(currentUser.storeName_pending || '').trim();
                    const requestedStore = String(updateData.storeName || '').trim();

                    if (!requestedStore) {
                        updateData = {
                            ...updateData,
                            storeName: approvedStore,
                            storeName_pending: pendingStore,
                            storeName_change_requested_at: pendingStore ? currentUser.storeName_change_requested_at || null : null
                        };
                    } else if (!approvedStore && !pendingStore) {
                        updateData = {
                            ...updateData,
                            storeName: '',
                            storeName_pending: requestedStore,
                            storeName_change_requested_at: new Date().toISOString()
                        };
                    } else if (requestedStore !== approvedStore && requestedStore !== pendingStore) {
                        updateData = {
                            ...updateData,
                            storeName: approvedStore,
                            storeName_pending: requestedStore,
                            storeName_change_requested_at: currentUser.storeName_change_requested_at || new Date().toISOString()
                        };
                    } else {
                        updateData = {
                            ...updateData,
                            storeName: approvedStore,
                            storeName_pending: pendingStore || approvedStore,
                            storeName_change_requested_at: pendingStore ? currentUser.storeName_change_requested_at || null : null
                        };
                    }
                }

                try {
                    const { data, error } = await supabase.from('users').update(updateData).eq('id', userId).select();
                    if (error) throw new Error(error.message);
                    result = data[0];
                } catch (error) {
                    if (!isStoreApprovalSchemaError(error.message)) throw error;
                    const fallbackData = stripStoreApprovalFields(updateData);
                    const { data, error: fallbackError } = await supabase.from('users').update(fallbackData).eq('id', userId).select();
                    if (fallbackError) throw new Error(fallbackError.message);
                    result = data[0];
                }
                break;
            }
            case 'approveStoreNameChange': {
                const { userId, approvedStoreName, adminId } = payload;
                const cleanedStore = String(approvedStoreName || '').trim();
                try {
                    const { error } = await supabase.from('users').update({
                        storeName: cleanedStore,
                        storeName_pending: '',
                        storeName_change_requested_at: null
                    }).eq('id', userId);
                    if (error) throw new Error(error.message);
                    if (adminId) await logAction(`Admin approved store name for user ${userId}`, adminId);
                    result = { success: true };
                } catch (error) {
                    if (!isStoreApprovalSchemaError(error.message)) throw error;
                    const { error: fallbackError } = await supabase.from('users').update({
                        storeName: cleanedStore
                    }).eq('id', userId);
                    if (fallbackError) throw new Error(fallbackError.message);
                    if (adminId) await logAction(`Admin approved store name for user ${userId}`, adminId);
                    result = { success: true };
                }
                break;
            }
            case 'rejectStoreNameChange': {
                const { userId, adminId } = payload;
                try {
                    const { error } = await supabase.from('users').update({
                        storeName_pending: '',
                        storeName_change_requested_at: null
                    }).eq('id', userId);
                    if (error) throw new Error(error.message);
                    if (adminId) await logAction(`Admin rejected store name change for user ${userId}`, adminId);
                    result = { success: true };
                } catch (error) {
                    if (!isStoreApprovalSchemaError(error.message)) throw error;
                    const { error: fallbackError } = await supabase.from('users').update({}).eq('id', userId);
                    if (fallbackError) throw new Error(fallbackError.message);
                    if (adminId) await logAction(`Admin rejected store name change for user ${userId}`, adminId);
                    result = { success: true };
                }
                break;
            }
            case 'updateUserStatus': {
                const { id, status, adminId } = payload;
                const { error } = await supabase.from('users').update({ status }).eq('id', id);
                if (error) throw new Error(error.message);
                if (adminId) await logAction(`Admin updated user ${id} status to ${status}`, adminId);
                result = { success: true };
                break;
            }
            case 'getGlobalCommission': {
                const { data, error } = await supabase.from('app_config').select('globalCommission').single();
                if (error) throw new Error(error.message);
                result = { globalCommission: data.globalCommission };
                break;
            }
            case 'setGlobalCommission': {
                const { commission, adminId } = payload;
                const { error } = await supabase.from('app_config').update({ globalCommission: commission }).eq('id', 1);
                if (error) throw new Error(error.message);
                if (adminId) await logAction(`Admin updated global commission to ${commission}%`, adminId);
                result = { success: true };
                break;
            }
            case 'getProducts': {
                const { sellerId } = payload;
                let query = supabase.from('products').select('*');
                if (sellerId) {
                    query = query.eq('seller_id', sellerId);
                } else {
                    query = query.or('visible_to_users.is.null,visible_to_users.eq.true');
                }
                const { data, error } = await query;
                if (error) throw new Error(error.message);
                result = data;
                break;
            }
            case 'addProduct': {
                const { productData } = payload;
                const normalizedProduct = normalizeProductData(productData);
                const resolvedStoreName = await resolveProductStoreName(normalizedProduct.seller_id, normalizedProduct.storeName);
                const id = normalizedProduct.id || `p-${Math.random().toString(36).substr(2, 9)}`;
                const product = {
                    ...normalizedProduct,
                    storeName: resolvedStoreName,
                    slug: createSlug(normalizedProduct.slug) || createSlug(normalizedProduct.name) || id,
                    id,
                };
                const { data, error } = await supabase.from('products').insert([product]).select();
                if (error) throw new Error(error.message);
                result = data[0];
                break;
            }
            case 'updateProduct': {
                const { productId, productData } = payload;
                const normalizedProduct = normalizeProductData(productData);
                const resolvedStoreName = await resolveProductStoreName(normalizedProduct.seller_id, normalizedProduct.storeName);
                const { data, error } = await supabase.from('products').update({ ...normalizedProduct, storeName: resolvedStoreName }).eq('id', productId).select();
                if (error) throw new Error(error.message);
                result = data[0];
                break;
            }
            case 'deleteProduct': {
                const { productId } = payload;
                const { error } = await supabase.from('products').delete().eq('id', productId);
                if (error) throw new Error(error.message);
                result = { success: true };
                break;
            }
            case 'getProductCategories': {
                const { data, error } = await supabase
                    .from('product_categories')
                    .select('id, name')
                    .eq('active', true)
                    .order('name', { ascending: true });
                if (error) throw new Error(error.message);
                result = data;
                break;
            }
            case 'addProductCategory': {
                const categoryName = String(payload.category || '').trim();
                if (!categoryName) throw new Error('Category name is required');
                const { data, error } = await supabase
                    .from('product_categories')
                    .upsert({ name: categoryName, active: true }, { onConflict: 'name' })
                    .select('id, name')
                    .single();
                if (error) throw new Error(error.message);
                result = data;
                break;
            }
            case 'getOrders': {
                const { sellerId, customerId } = payload;
                let query = supabase.from('orders').select('*').order('date', { ascending: false });
                if (sellerId) query = query.eq('seller_id', sellerId);
                if (customerId) query = query.eq('customer_id', customerId);
                const { data, error } = await query;
                if (error) throw new Error(error.message);
                result = data;
                break;
            }
            case 'saveOrder': {
                const { order } = payload;
                const configData = await supabase.from('app_config').select('globalCommission').single();
                const perc = configData.data?.globalCommission || 12;
                const commAmt = (order.total * perc) / 100;
                const sellerAmt = order.total - commAmt;

                const now = new Date();
                const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
                const invoiceSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
                const invoiceNo = `INV-${dateStr}-${invoiceSuffix}`;
                const trackingId = `MCS-TRK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

                const orderData = {
                    ...order,
                    invoice_no: invoiceNo,
                    tracking_id: trackingId,
                    commission_percentage: perc,
                    commission_amount: commAmt,
                    seller_payable_amount: sellerAmt,
                    date: now.toISOString()
                };

                const { data, error } = await supabase.from('orders').insert([orderData]).select();
                if (error) throw new Error(error.message);
                result = data[0];
                break;
            }
            case 'updateOrderStatus': {
                const { id, status, role, userId } = payload;
                let updateData = { status };
                if (status === 'cancelled') {
                    updateData.payment_status = 'cancelled';
                    updateData.customer_payment_status = 'cancelled';
                }
                const { error } = await supabase.from('orders').update(updateData).eq('id', id);
                if (error) throw new Error(error.message);
                if (role === 'admin') await logAction(`Admin forced status ${status} on order ${id}`, userId);
                result = { success: true };
                break;
            }
            case 'updateOrderDetails': {
                const { orderId, customer, userId } = payload;
                const { data: order, error: orderError } = await supabase.from('orders').select('customer_id, status').eq('id', orderId).single();
                if (orderError) throw new Error(orderError.message);
                if (order.customer_id !== userId) throw new Error('You can only edit your own order.');
                if (order.status !== 'pending') throw new Error('Only pending orders can be edited.');
                const { error } = await supabase.from('orders').update({ customer }).eq('id', orderId);
                if (error) throw new Error(error.message);
                result = { success: true };
                break;
            }
            case 'confirmPayout': {
                const { orderId, adminId } = payload;
                const { error } = await supabase.from('orders').update({
                    payment_status: 'paid',
                    mcs_payment_status: 'done'
                }).eq('id', orderId);
                if (error) throw new Error(error.message);
                if (adminId) await logAction(`Admin confirmed payout for order ${orderId}`, adminId);
                result = { success: true };
                break;
            }
            case 'updateCustomerPaymentVerified': {
                const { orderId, verified, adminId } = payload;
                const { error } = await supabase.from('orders').update({
                    customer_payment_verified: verified,
                    customer_payment_status: verified ? 'done' : 'pending'
                }).eq('id', orderId);
                if (error) throw new Error(error.message);
                if (adminId) await logAction(`Admin verified customer payment for order ${orderId}`, adminId);
                result = { success: true };
                break;
            }
            case 'getLogs': {
                const { data, error } = await supabase.from('logs').select('*').order('timestamp', { ascending: false });
                if (error) throw new Error(error.message);
                result = data;
                break;
            }
            case 'addReview': {
                const { reviewData } = payload;
                const { data, error } = await supabase.from('reviews').insert([{
                    id: `r-${Math.random().toString(36).substr(2, 9)}`,
                    date: new Date().toISOString(),
                    pinned: false,
                    ...reviewData
                }]).select();
                if (error) throw new Error(error.message);
                result = data[0];
                break;
            }
            case 'pinReview': {
                const { reviewId, pinned } = payload;
                const { data, error } = await supabase.from('reviews').update({ pinned }).eq('id', reviewId).select();
                if (error) throw new Error(error.message);
                result = data[0];
                break;
            }
            case 'getReviews': {
                const { productId } = payload;
                const { data: reviews, error: reviewError } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('productId', productId)
                    .order('pinned', { ascending: false })
                    .order('date', { ascending: false });
                
                if (reviewError) throw new Error(reviewError.message);

                if (reviews && reviews.length > 0) {
                    const userIds = [...new Set(reviews.filter(r => r.userId).map(r => r.userId))];
                    if (userIds.length > 0) {
                        const { data: users, error: userError } = await supabase
                            .from('users')
                            .select('id, avatar_url, name')
                            .in('id', userIds);
                        
                        if (!userError && users) {
                            const userMap = Object.fromEntries(users.map(u => [u.id, u]));
                            result = reviews.map(r => ({
                                ...r,
                                user: userMap[r.userId] || null
                            }));
                        } else {
                            result = reviews;
                        }
                    } else {
                        result = reviews;
                    }
                } else {
                    result = reviews;
                }
                break;
            }
            case 'getWishlists': {
                const { sellerId } = payload;
                const { data, error } = await supabase.from('wishlists').select('*, product:products!productId(*), customer:users!userId(*)');
                if (error) throw new Error(error.message);
                if (sellerId) {
                    result = data.filter((w) => w.product && w.product.seller_id === sellerId);
                } else {
                    result = data;
                }
                break;
            }
            case 'addToWishlist': {
                const { userId, productId } = payload;
                const { data, error } = await supabase.from('wishlists').insert([{
                    id: `w-${Math.random().toString(36).substr(2, 9)}`,
                    userId,
                    productId
                }]).select();
                if (error) throw new Error(error.message);
                result = data[0];
                break;
            }
            case 'removeFromWishlist': {
                const { userId, productId } = payload;
                const { error } = await supabase.from('wishlists').delete().eq('userId', userId).eq('productId', productId);
                if (error) throw new Error(error.message);
                result = { success: true };
                break;
            }
            case 'getHeroSlides': {
                const { data, error } = await supabase.from('hero_slides').select('*').order('sort_order', { ascending: true });
                if (error) throw new Error(error.message);
                result = data;
                break;
            }
            case 'saveHeroSlide': {
                const { slide, adminId } = payload;
                const slideData = {
                    id: slide.id || `h-${Math.random().toString(36).substr(2, 9)}`,
                    cta_label: slide.cta_label || slide.cta || 'Explore Collection',
                    cta_link: slide.cta_link || slide.link || '/products',
                    image: slide.image || '',
                    sort_order: slide.sort_order ?? 0,
                    active: slide.active ?? true
                };
                const { data, error } = await supabase.from('hero_slides').upsert([slideData]).select();
                if (error) throw new Error(error.message);
                if (adminId) await logAction(`Admin saved hero slide "${slideData.cta_label}"`, adminId);
                result = data[0];
                break;
            }
            case 'deleteHeroSlide': {
                const { id, adminId } = payload;
                const { error } = await supabase.from('hero_slides').delete().eq('id', id);
                if (error) throw new Error(error.message);
                if (adminId) await logAction(`Admin deleted hero slide ${id}`, adminId);
                result = { success: true };
                break;
            }
            case 'getJournalPosts': {
                const { data, error } = await supabase.from('journal_posts').select('*').order('created_at', { ascending: false });
                if (error) throw new Error(error.message);
                result = data;
                break;
            }
            case 'saveJournalPost': {
                const { post, adminId } = payload;
                const postData = { ...post };
                if (!postData.id) postData.id = `j-${Math.random().toString(36).substr(2, 9)}`;
                const { data, error } = await supabase.from('journal_posts').upsert([postData]).select();
                if (error) throw new Error(error.message);
                if (adminId) await logAction(`Admin saved journal post "${postData.title}"`, adminId);
                result = data[0];
                break;
            }
            case 'deleteJournalPost': {
                const { id, adminId } = payload;
                const { error } = await supabase.from('journal_posts').delete().eq('id', id);
                if (error) throw new Error(error.message);
                if (adminId) await logAction(`Admin deleted journal post ${id}`, adminId);
                result = { success: true };
                break;
            }
            case 'subscribeJournalEmail': {
                const email = String(payload.email || '').trim().toLowerCase();
                if (!email || !email.includes('@') || !email.includes('.')) {
                    throw new Error('Enter a valid email address.');
                }

                const { data, error } = await supabase.from('journal_subscribers').upsert([
                    {
                        id: `js-${Math.random().toString(36).substr(2, 9)}`,
                        email,
                        created_at: new Date().toISOString()
                    }
                ], { onConflict: 'email' }).select();

                if (error) throw new Error(error.message);
                result = { success: true, email: data?.[0]?.email || email };
                break;
            }
            default:
                throw new Error('Invalid action');
        }

        res.json(result);
    } catch (error) {
        console.error("DB Service Error:", error);
        res.status(400).json({ error: error.message });
    }
});

app.use(express.static(path.join(__dirname, 'dist')));

const escapeHtmlAttribute = (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const defaultShareImage = 'https://res.cloudinary.com/djmbuuz28/image/upload/v1761108817/logo.png';

const buildProductShareImageUrl = (product = {}) => {
    const configuredCloudName = cloudinaryCloudName || 'djmbuuz28';

    const candidateImages = [
        ...(Array.isArray(product.images) ? product.images : []),
        product.image,
        product.product_image_id,
        product.image_public_id,
        product.cloudinary_public_id,
    ].filter(Boolean);

    const normalizeCloudinaryImage = (value) => {
        const candidate = String(value || '').trim();
        if (!candidate) return null;

        const directPublicId = candidate
            .replace(/^https?:\/\/[^/]+\/[^/]+\/image\/upload\/(?:v\d+\/)?/, '')
            .replace(/^https?:\/\/[^/]+\//, '')
            .replace(/\.[^.]+$/, '')
            .replace(/^\//, '');

        if (directPublicId && directPublicId !== candidate) {
            return `https://res.cloudinary.com/${configuredCloudName}/image/upload/w_1200,h_630,c_fill,f_jpg,q_auto/${directPublicId}`;
        }

        if (candidate.includes('/image/upload/')) {
            try {
                const parsedUrl = new URL(candidate);
                const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
                const uploadIndex = pathParts.indexOf('upload');
                if (uploadIndex !== -1) {
                    const publicId = pathParts.slice(uploadIndex + 1).join('/').replace(/^v\d+\//, '').replace(/\.[^.]+$/, '');
                    if (publicId) {
                        return `https://res.cloudinary.com/${configuredCloudName}/image/upload/w_1200,h_630,c_fill,f_jpg,q_auto/${publicId}`;
                    }
                }
            } catch (error) {
                console.warn('Unable to normalize Cloudinary product image URL for share preview:', error.message);
            }
        }

        return candidate;
    };

    for (const imageCandidate of candidateImages) {
        const normalized = normalizeCloudinaryImage(imageCandidate);
        if (normalized) {
            return normalized;
        }
    }

    return defaultShareImage;
};

app.get('/share/product/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const frontendBaseUrl = process.env.PUBLIC_FRONTEND_URL || process.env.VITE_APP_URL || `${req.protocol}://${req.get('host')}`;
        const targetProductUrl = `${frontendBaseUrl.replace(/\/+$/, '')}/product/${encodeURIComponent(productId)}`;

        const { data: product, error } = await supabase
            .from('products')
            .select('id, slug, name, title, description, image, product_image_id, image_public_id, cloudinary_public_id')
            .eq('id', productId)
            .maybeSingle();

        if (error) {
            console.error('Share product lookup failed:', error.message);
            return res.redirect(`${frontendBaseUrl.replace(/\/+$/, '')}/`);
        }

        if (!product) {
            return res.redirect(`${frontendBaseUrl.replace(/\/+$/, '')}/`);
        }

        const productTitle = String(product.title || product.name || 'Mithila Chitrakala Store').trim();
        const productDescription = String(product.description || `Discover ${productTitle} at Mithila Chitrakala Store.`).trim();
        const shareImage = buildProductShareImageUrl(product);
        const ogUrl = `${frontendBaseUrl.replace(/\/+$/, '')}/product/${encodeURIComponent(product.slug || productId)}`;
        const pageTitle = `${productTitle} | Mithila Chitrakala Store`;
        const safeDescription = productDescription || `Discover ${productTitle} at Mithila Chitrakala Store.`;

        const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtmlAttribute(pageTitle)}</title>
    <meta name="description" content="${escapeHtmlAttribute(safeDescription)}" />
    <meta property="og:type" content="product" />
    <meta property="og:title" content="${escapeHtmlAttribute(pageTitle)}" />
    <meta property="og:description" content="${escapeHtmlAttribute(safeDescription)}" />
    <meta property="og:image" content="${escapeHtmlAttribute(shareImage)}" />
    <meta property="og:url" content="${escapeHtmlAttribute(ogUrl)}" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${escapeHtmlAttribute(pageTitle)}" />
    <meta property="twitter:description" content="${escapeHtmlAttribute(safeDescription)}" />
    <meta property="twitter:image" content="${escapeHtmlAttribute(shareImage)}" />
    <script>
      window.location.replace(${JSON.stringify(ogUrl)});
    </script>
  </head>
  <body></body>
</html>`;

        res.set('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (error) {
        console.error('Share proxy error:', error);
        return res.redirect('/');
    }
});

app.get('/product/:slug', async (req, res, next) => {
    try {
        const { data: product, error } = await supabase
            .from('products')
            .select('name, description, image, slug')
            .eq('slug', req.params.slug)
            .maybeSingle();

        if (error || !product) return next();

        const title = `${product.name} | Mithila Chitrakala Store`;
        const description = product.description || `Discover ${product.name} at Mithila Chitrakala Store.`;
        const pageUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        let html = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf8');
        const metadata = {
            '<title>Mithila Chitrakala Store - Premium Traditional Art</title>': `<title>${escapeHtmlAttribute(title)}</title>`,
            '<meta name="description" content="Discover authentic Mithila art, handmade crafts, textiles, home decor, and cultural gifts from local artists.">': `<meta name="description" content="${escapeHtmlAttribute(description)}">`,
            '<meta property="og:title" content="Mithila Chitrakala Store - Premium Traditional Art">': `<meta property="og:title" content="${escapeHtmlAttribute(title)}">`,
            '<meta property="og:description" content="Explore authentic Mithila artwork, handmade crafts, textiles, and cultural treasures from local artists.">': `<meta property="og:description" content="${escapeHtmlAttribute(description)}">`,
            '<meta property="og:url" content="/">': `<meta property="og:url" content="${escapeHtmlAttribute(pageUrl)}">`,
            '<meta property="og:image" content="https://res.cloudinary.com/djmbuuz28/image/upload/v1761108817/logo.png">': `<meta property="og:image" content="${escapeHtmlAttribute(product.image)}">`,
            '<meta name="twitter:title" content="Mithila Chitrakala Store - Premium Traditional Art">': `<meta name="twitter:title" content="${escapeHtmlAttribute(title)}">`,
            '<meta name="twitter:description" content="Explore authentic Mithila artwork, handmade crafts, textiles, and cultural treasures from local artists.">': `<meta name="twitter:description" content="${escapeHtmlAttribute(description)}">`,
            '<meta name="twitter:image" content="https://res.cloudinary.com/djmbuuz28/image/upload/v1761108817/logo.png">': `<meta name="twitter:image" content="${escapeHtmlAttribute(product.image)}">`,
        };

        Object.entries(metadata).forEach(([source, replacement]) => {
            html = html.replace(source, replacement);
        });
        html = html.replace('</head>', `<link rel="canonical" href="${escapeHtmlAttribute(pageUrl)}">\n</head>`);
        res.send(html);
    } catch (error) {
        next(error);
    }
});


// Handle SPA routing: send all non-API requests to index.html
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
}); 

app.listen(PORT, () => {
    console.log(`Node Server running on http://localhost:${PORT}`);
});
