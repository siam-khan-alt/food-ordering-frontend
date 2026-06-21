export default function SectionHeader({ 
  tag, 
  icon: Icon, 
  titleNormal, 
  titleItalic, 
  titleEnd = "", 
  align = "center", 
  tagColor = "bg-brand/10 text-brand border-brand/20" 
}) {
  
  const alignmentMap = {
    left: {
      wrapper: "text-left items-start",
      container: "w-full"
    },
    center: {
      wrapper: "text-center items-center mx-auto",
      container: "text-center max-w-xl mx-auto"
    },
    right: {
      wrapper: "text-right items-end ml-auto",
      container: "w-full text-right"
    }
  };

  const classes = alignmentMap[align] || alignmentMap.center;

  return (
    <div className={`${classes.container} mb-12 relative z-10 flex flex-col ${classes.wrapper}`}>
      {tag && (
        <span className={`inline-flex items-center gap-2 text-[10px] sm:text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full border mb-4 shadow-sm ${tagColor}`}>
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {tag}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-black text-text-main tracking-tight leading-tight">
        {titleNormal}{" "}
        <span className="text-brand italic font-light">{titleItalic}</span>
        {titleEnd && ` ${titleEnd}`}
      </h2>
    </div>
  );
}