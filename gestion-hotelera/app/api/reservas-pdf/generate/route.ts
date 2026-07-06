import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

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

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const targetUrl = `${baseUrl}/api/reservas-pdf?${query}`;

        await page.goto(targetUrl, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
        });

        await browser.close();

        return new NextResponse(Buffer.from(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="reservaciones-diarias.pdf"',
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'No se pudo generar el PDF' }, { status: 500 });
    }
}
