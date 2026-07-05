import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center" className="flex flex-col gap-6 justify-center items-center flex-1">
        <div className="hero relative">
          <img src={heroImg} className="base mx-auto relative z-0" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework absolute" style={{ top: '34px', height: '28px', transform: 'perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg) scale(1.4)' }} alt="React logo" />
          <img src={viteLogo} className="vite absolute" style={{ top: '107px', height: '26px', transform: 'perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg) scale(0.8)' }} alt="Vite logo" />
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-medium tracking-tight mb-8 md:text-4xl md:mb-5">Get started</h1>
          <p>
            Edit <code className="inline-flex rounded px-2 py-1 bg-gray-100 text-gray-900 font-mono text-[15px] leading-[135%]">src/App.jsx</code> and save to test <code className="inline-flex rounded px-2 py-1 bg-gray-100 text-gray-900 font-mono text-[15px] leading-[135%]">HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter font-mono inline-flex rounded text-[16px] px-[10px] py-[5px] text-primary bg-primary/10 border-2 border-transparent transition-colors duration-300 hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary mb-6"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks relative w-full before:content-[''] before:absolute before:top-[-4.5px] before:left-0 before:border-5 before:border-transparent before:border-l-gray-200 after:content-[''] after:absolute after:top-[-4.5px] after:right-0 after:border-5 after:border-transparent after:border-r-gray-200"></div>

      <section id="next-steps" className="flex border-t border-gray-200 text-left">
        <div id="docs" className="flex-1 p-8 border-r border-gray-200 md:p-6 md:px-5">
          <svg className="icon mb-4 w-[22px] h-[22px]" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2 className="text-2xl font-medium tracking-tight mb-2 md:text-xl">Documentation</h2>
          <p>Your questions, answered</p>
          <ul className="list-none p-0 flex gap-2 mt-8 md:mt-5">
            <li>
              <a href="https://vite.dev/" target="_blank" className="inline-flex items-center gap-2 px-3 py-[6px] rounded-md bg-gray-100 text-gray-900 no-underline text-[16px] transition-shadow duration-300 hover:shadow-md">
                <img className="logo h-[18px]" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" className="inline-flex items-center gap-2 px-3 py-[6px] rounded-md bg-gray-100 text-gray-900 no-underline text-[16px] transition-shadow duration-300 hover:shadow-md">
                <img className="button-icon h-[18px] w-[18px]" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social" className="flex-1 p-8 md:p-6 md:px-5">
          <svg className="icon mb-4 w-[22px] h-[22px]" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2 className="text-2xl font-medium tracking-tight mb-2 md:text-xl">Connect with us</h2>
          <p>Join the Vite community</p>
          <ul className="list-none p-0 flex gap-2 mt-8 md:mt-5">
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank" className="inline-flex items-center justify-center p-[6px] rounded-md bg-gray-100 text-gray-900 no-underline text-[16px] transition-colors duration-300 hover:bg-gray-200 md:w-full">
                <svg className="button-icon h-[18px] w-[18px]" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                <span className="hidden md:inline ml-2">GitHub</span>
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank" className="inline-flex items-center justify-center p-[6px] rounded-md bg-gray-100 text-gray-900 no-underline text-[16px] transition-colors duration-300 hover:bg-gray-200 md:w-full">
                <svg className="button-icon h-[18px] w-[18px]" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                <span className="hidden md:inline ml-2">Discord</span>
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank" className="inline-flex items-center justify-center p-[6px] rounded-md bg-gray-100 text-gray-900 no-underline text-[16px] transition-colors duration-300 hover:bg-gray-200 md:w-full">
                <svg className="button-icon h-[18px] w-[18px]" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                <span className="hidden md:inline ml-2">X.com</span>
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank" className="inline-flex items-center justify-center p-[6px] rounded-md bg-gray-100 text-gray-900 no-underline text-[16px] transition-colors duration-300 hover:bg-gray-200 md:w-full">
                <svg className="button-icon h-[18px] w-[18px]" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                <span className="hidden md:inline ml-2">Bluesky</span>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks relative w-full before:content-[''] before:absolute before:top-[-4.5px] before:left-0 before:border-5 before:border-transparent before:border-l-gray-200 after:content-[''] after:absolute after:top-[-4.5px] after:right-0 after:border-5 after:border-transparent after:border-r-gray-200"></div>
      <section id="spacer" className="h-[88px] border-t border-gray-200 md:h-12"></section>
    </>
  )
}

export default App
