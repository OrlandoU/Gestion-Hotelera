export default function PageHeader({ name, subtitle, buttons }: { name: string, subtitle: string, buttons: React.ReactNode }) {
    return (<div className="flex justify-between items-end">
        <div>
            <h2 className="font-['Manrope'] text-[32px] leading-[40px] tracking-[-0.02em] font-bold text-[#000000]">{name}</h2>
            <p className="text-[16px] leading-[24px] font-normal font-['Hanken_Grotesk'] text-[#515f74]">{subtitle}</p>
        </div>
        <div className="flex gap-[16px]">
            {buttons}
        </div>
    </div>);
}