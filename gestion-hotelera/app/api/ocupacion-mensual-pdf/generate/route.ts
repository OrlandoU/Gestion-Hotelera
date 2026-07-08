import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import path from 'path';
import fs from 'fs'

// Optional: Increase timeout if your page takes a moment to render
export const maxDuration = 60; // Configures Netlify/Vercel timeout limits (if supported by your tier)

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const fecha = searchParams.get('fecha') || '';

        const query = new URLSearchParams({
            fecha,
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
        const baseUrl = process.env.URL || 'http://localhost:3000';
        const targetUrl = `${baseUrl}/api/ocupacion-mensual-pdf?${query}`;

        await page.goto(targetUrl, {
            waitUntil: 'networkidle0',
            timeout: 15000
        });

        // Recharts usa ResizeObserver para calcular el tamaño del SVG después del montaje.
        // networkidle0 no garantiza que ya haya terminado ese cálculo, así que esperamos
        // explícitamente a que los SVGs de los gráficos tengan dimensiones reales.
        await page.waitForFunction(() => {
            const svgs = document.querySelectorAll('.recharts-wrapper svg');
            if (svgs.length === 0) return false;
            return Array.from(svgs).every(
                (svg) => svg.getAttribute('width') && parseFloat(svg.getAttribute('width')!) > 0
            );
        }, { timeout: 10000 }).catch(() => {
            // Si no hay gráficos en la página o falla la espera, seguimos igual
        });

        // Pequeño margen adicional para asegurar el pintado final del layout
        await new Promise((resolve) => setTimeout(resolve, 300));

        const logoPath = path.join(process.cwd(), 'public', 'logo.png');
                const logoBase64 = fs.readFileSync(logoPath).toString('base64');
                const logoDataUri = `data:image/png;base64,${logoBase64}`;
        
                const pdfBuffer = await page.pdf({
                    format: 'A4',
                    landscape: true,
                    printBackground: true,
                    margin: { top: '12mm', right: '12mm', bottom: '18mm', left: '12mm' },
                    displayHeaderFooter: true,
                    headerTemplate: `<div></div>`,
                    footerTemplate: `
                        <div style="width: 100%; padding: 0 12mm; display: flex; align-items: center; justify-content: space-between; font-family: Arial, sans-serif; font-size: 9px; color: #515f74;">
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <img src="${logoDataUri}" style="height: 14px; width: auto; object-fit: contain;" />
                                <span>Hotel San Pedro</span>
                            </div>
                            <div>
                                Página <span class="pageNumber"></span> de <span class="totalPages"></span>
                            </div>
                        </div>
                    `,
                });

        await browser.close();

        // Uint8Array/Buffer works directly with NextResponse
        return new NextResponse(Buffer.from(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="ocupacion-mensual.pdf"',
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