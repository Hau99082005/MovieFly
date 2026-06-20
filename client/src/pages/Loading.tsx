const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[80vh] gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-zinc-700 border-t-primary shadow-[0_0_20px_rgba(0,212,255,0.3)]"></div>
      <p className="text-white text-sm animate-pulse">Đang tải...</p>
    </div>
  );
};

export default Loading;
