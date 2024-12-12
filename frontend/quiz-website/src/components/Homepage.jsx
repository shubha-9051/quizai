import { useNavigate } from 'react-router-dom';

function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#faf5ef] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4e8dc] px-10 py-3">
          <div className="flex items-center gap-4 text-[#1f1409]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-[#1f1409] text-lg font-bold leading-tight tracking-[-0.015em]">Quizzy</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#1f1409] text-sm font-medium leading-normal" href="#">Dashboard</a>
              <a className="text-[#1f1409] text-sm font-medium leading-normal" href="#">Create</a>
              <a className="text-[#1f1409] text-sm font-medium leading-normal" href="#">Library</a>
              <a className="text-[#1f1409] text-sm font-medium leading-normal" href="#">Community</a>
              <a className="text-[#1f1409] text-sm font-medium leading-normal" href="#">Help</a>
            </div>
            <div className="flex gap-2">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f2800d] text-[#1f1409] text-sm font-bold leading-normal tracking-[0.015em]"
                onClick={() => navigate('/login')}
              >
                <span className="truncate">Log in</span>
              </button>
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f4e8dc] text-[#1f1409] text-sm font-bold leading-normal tracking-[0.015em]"
                onClick={() => navigate('/register')}
              >
                <span className="truncate">Sign up</span>
              </button>
            </div>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-3xl items-start justify-end px-4 pb-10 @[480px]:px-10"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/sdxl10/4d41e93d-132d-4e1f-a6ac-704a9ea1942c.png")`,
                  }}
                >
                  <div className="flex flex-col gap-2 text-left">
                    <h1
                      className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]"
                    >
                      Learn with Quizzy
                    </h1>
                    <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      The fun, engaging way to study. Get smarter with every quiz you take.
                    </h2>
                  </div>
                  <div className="flex-wrap gap-3 flex">
                    <button
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#f2800d] text-[#1f1409] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                      onClick={() => navigate('/login')}
                    >
                      <span className="truncate">Log in</span>
                    </button>
                    <button
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#f4e8dc] text-[#1f1409] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                      onClick={() => navigate('/register')}
                    >
                      <span className="truncate">Sign up</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-[#1f1409] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">What can you do with Quizzy?</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {Array(5).fill(<div className="flex flex-1 gap-3 rounded-lg border border-[#edd9c4] bg-[#faf5ef] p-4 flex-col">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-10 shrink-0"
                  style={{
                    backgroundImage: `url("https://cdn.usegalileo.ai/sdxl10/ec52ceac-8403-49e2-9562-3adab59594a9.png")`,
                  }}
                ></div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#1f1409] text-base font-bold leading-tight">Study smarter</h2>
                  <p className="text-[#ad7034] text-sm font-normal leading-normal">Get personalized study plans and track your progress over time.</p>
                </div>
              </div>).map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
            <div className="@container">
              <div className="flex flex-col justify-end gap-6 px-4 py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20">
                <div className="flex flex-col gap-2 text-center">
                  <h1
                    className="text-[#1f1409] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                  >
                    Ready to start?
                  </h1>
                  <p className="text-[#1f1409] text-base font-normal leading-normal max-w-[720px">
                    With thousands of quizzes on every topic, there's no limit to what you can learn on Quizzy.
                  </p>
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="flex justify-center">
                    <button
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#f2800d] text-[#1f1409] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] grow"
                    >
                      <span className="truncate">View all quizzes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="layout-content-container flex flex-col"></div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;