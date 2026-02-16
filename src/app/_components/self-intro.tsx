type Props = {
  lang: string;
};

export function SelfIntro({ lang }: Props) {
  const isEn = lang === "en";

  return (
    <section className="flex-col md:flex-row flex items-start md:justify-between mt-16 mb-16 md:mb-12">
      <div className="md:w-2/3">
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8 mb-8">
          {isEn ? "Jiazhao Xu" : "许嘉昭"}
        </h1>
        <div className="text-lg leading-relaxed mb-4">
          {isEn ? (
            <>
              <p className="mb-4">
                I focus on integrating AI with software and hardware experiences to create intelligent and human-centered products. I’m driven by a results-oriented approach to design—turning creative insight into tangible business value and lasting impact.
              </p>
              <p className="mb-4">
                I graduated from ArtCenter College of Design, currently working at Microsoft. I am also an entrepreneur, educator, and PPT expert.
              </p>
            </>
          ) : (
            <>
              <p className="mb-4">
                我专注于融合AI与软硬件体验，打造智能且有温度的产品。以商业成果为导向，我致力于让设计在企业中创造真实价值与可衡量的影响力。
              </p>
              <p className="mb-4">
                我本科毕业于艺术中心设计学院，目前在微软工作。我同时也是一名创业者、教育者和PPT专家。
              </p>
            </>
          )}
        </div>
        <div className="flex gap-4 text-lg font-bold">
          <a href="mailto:hello@xujiazhao.com" className="hover:underline">Email</a>
          <a href="https://www.linkedin.com/in/xujiazhao/" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
          {isEn ? <span>WeChat: xux-ai</span> : <span>微信: xux-ai</span>}
        </div>
      </div>
    </section>
  );
}
