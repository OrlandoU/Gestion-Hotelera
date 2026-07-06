import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// Optional: Increase timeout if your page takes a moment to render
export const maxDuration = 60; // Configures Netlify/Vercel timeout limits (if supported by your tier)

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const fecha = searchParams.get('fecha') || '';
        const estado = searchParams.get('estado') || 'Todos';
        const busqueda = searchParams.get('busqueda') || '';
        const ordenar = searchParams.get('ordenar') || 'reserva';

        const query = new URLSearchParams({
            fecha,
            estado,
            busqueda,
            ordenar,
        }).toString();

        const isLocal = process.env.NODE_ENV === 'development';
        let launchOptions = {};

        if (isLocal) {
            // Local Windows configuration using your installed Chrome
            launchOptions = {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                defaultViewport: { width: 1440, height: 900 },
                executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                headless: true,
            };
        } else {
            // Serverless configuration for Netlify/Linux containers
            const prodExecutablePath = await chromium.executablePath(
                '/var/task/node_modules/@sparticuz/chromium/bin'
            );

            launchOptions = {
                args: chromium.args ?? [],
                defaultViewport: { width: 1440, height: 900 },
                executablePath: prodExecutablePath,
                headless: true,
            };
        }

        // Launch browser using the environment-specific configurations
        const browser = await puppeteer.launch(launchOptions);

        const page = await browser.newPage();
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const targetUrl = `${baseUrl}/api/reservas-pdf?${query}`;

        await page.goto(targetUrl, {
            waitUntil: 'networkidle0',
            timeout: 15000 // 15 seconds max to prevent infinite hangs
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
        });

        await browser.close();

        // Uint8Array/Buffer works directly with NextResponse
        return new NextResponse(Buffer.from(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="reservaciones-diarias.pdf"',
            },
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({
            error: 'No se pudo generar el PDF',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}