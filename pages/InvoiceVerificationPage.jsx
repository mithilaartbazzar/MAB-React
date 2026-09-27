import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { BadgeCheck, CircleAlert, LoaderCircle } from 'lucide-react';
import { dbService } from '../services/dbservices';

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

export const InvoiceVerificationPage = () => {
    const { invoiceNo } = useParams();
    const [searchParams] = useSearchParams();
    const requestedNumbers = searchParams.get('invoices') || invoiceNo || '';
    const invoiceNumbers = [...new Set(requestedNumbers.split(',').map((value) => value.trim()).filter(Boolean))];
    const invoiceKey = invoiceNumbers.join(',');
    const [result, setResult] = useState({ status: 'loading', invoices: [] });

    useEffect(() => {
        let isCurrentRequest = true;
        const numbers = invoiceKey.split(',').filter(Boolean);

        if (numbers.length === 0) {
            setResult({ status: 'not-found', invoices: [] });
            return () => { isCurrentRequest = false; };
        }

        setResult({ status: 'loading', invoices: [] });
        dbService.getPublicInvoices(numbers)
            .then((invoices) => {
                if (!isCurrentRequest) return;
                const byInvoiceNumber = new Map(invoices.map((invoice) => [invoice.invoice_no, invoice]));
                const orderedInvoices = numbers.map((number) => byInvoiceNumber.get(number)).filter(Boolean);
                setResult({
                    status: orderedInvoices.length === numbers.length ? 'verified' : 'not-found',
                    invoices: orderedInvoices,
                });
            })
            .catch(() => {
                if (isCurrentRequest) setResult({ status: 'error', invoices: [] });
            });

        return () => { isCurrentRequest = false; };
    }, [invoiceKey]);

    const isLoading = result.status === 'loading';
    const isVerified = result.status === 'verified';

    return (
        <main className="min-h-[65vh] bg-[#f8f6f2] px-4 py-14 text-[#241f1a] sm:px-6 sm:py-20">
            <div className="mx-auto max-w-3xl">
                <header className="border-b border-[#e7e0d2] pb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7c2020]">Mithila Chitrakala Store</p>
                    <h1 className="mt-3 font-playfair text-3xl font-black sm:text-4xl">Invoice verification</h1>
                </header>

                <section className="mt-8 border border-[#e7e0d2] bg-white p-5 sm:p-8" aria-live="polite">
                    <div className="flex items-start gap-4">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${isVerified ? 'bg-green-50 text-green-700' : 'bg-[#f5ead9] text-[#7c2020]'}`}>
                            {isLoading ? <LoaderCircle size={21} className="animate-spin" /> : isVerified ? <BadgeCheck size={22} /> : <CircleAlert size={21} />}
                        </span>
                        <div className="min-w-0 flex-1">
                            <h2 className="font-playfair text-xl font-bold">
                                {isLoading ? 'Checking invoice...' : isVerified ? 'Invoice verified' : result.status === 'error' ? 'Verification unavailable' : 'Invoice not found'}
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-[#71695e]">
                                {isLoading
                                    ? 'We are checking this invoice against the store records.'
                                    : isVerified
                                        ? 'The invoice number matches a record in the store.'
                                        : result.status === 'error'
                                            ? 'We could not reach the verification service. Please try scanning again shortly.'
                                            : 'No matching invoice was found. Check the QR code or contact the store for help.'}
                            </p>
                        </div>
                    </div>

                    {isVerified && result.invoices.map((invoice) => (
                        <article key={invoice.invoice_no} className="mt-7 border-t border-[#eee6d9] pt-5 first:mt-7">
                            <dl className="grid gap-4 text-sm sm:grid-cols-2">
                                <div><dt className="text-xs font-bold uppercase tracking-wider text-[#8b8378]">Invoice number</dt><dd className="mt-1 break-all font-semibold">{invoice.invoice_no}</dd></div>
                                <div><dt className="text-xs font-bold uppercase tracking-wider text-[#8b8378]">Issue date</dt><dd className="mt-1 font-semibold">{new Date(invoice.date).toLocaleDateString()}</dd></div>
                                <div><dt className="text-xs font-bold uppercase tracking-wider text-[#8b8378]">Order status</dt><dd className="mt-1 font-semibold capitalize">{invoice.status || 'Pending'}</dd></div>
                                <div><dt className="text-xs font-bold uppercase tracking-wider text-[#8b8378]">Total</dt><dd className="mt-1 font-semibold">{formatCurrency(invoice.total)}</dd></div>
                            </dl>
                            <div className="mt-5 border-t border-[#eee6d9] pt-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b8378]">Items</h3>
                                <ul className="mt-2 divide-y divide-[#f0e9df]">
                                    {(invoice.items || []).map((item, index) => (
                                        <li key={`${item.name}-${index}`} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2 text-sm">
                                            <span>{item.name || 'Mithila artwork'} <span className="text-[#8b8378]">× {item.quantity || 1}</span></span>
                                            <span className="font-semibold">{formatCurrency(Number(item.price || 0) * Number(item.quantity || 1))}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    ))}

                    {!isLoading && (
                        <Link to="/" className="mt-7 inline-flex min-h-10 items-center border border-[#d7c8b6] px-4 text-xs font-bold text-[#7c2020] transition-colors hover:bg-[#f8f6f2]">
                            Return to store
                        </Link>
                    )}
                </section>
            </div>
        </main>
    );
};