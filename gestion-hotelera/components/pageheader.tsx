export default function PageHeader({ name, subtitle, buttons }: { name: string, subtitle: string, buttons: React.ReactNode | null }) {
    return (<div className="flex justify-between items-end">
        <div>
            <h2 className="font-['Hanken_Grotesk'] text-[32px] leading-10 tracking-[-0.02em] font-bold text-[#000000]">{name}</h2>
            <p className="text-[16px] leading-6 font-normal font-['Hanken_Grotesk'] text-[#515f74]">{subtitle}</p>
        </div>
        <div className="flex gap-4">
            {buttons}
        </div>
    </div>);
}