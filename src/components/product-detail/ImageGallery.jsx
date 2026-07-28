import { useRef, useState } from 'react'

export function ImageGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const thumbnailRefs = useRef([])

  function moveFocus(nextIndex) {
    const clamped = (nextIndex + images.length) % images.length
    setActiveIndex(clamped)
    thumbnailRefs.current[clamped]?.focus()
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      moveFocus(activeIndex + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      moveFocus(activeIndex - 1)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <img
        src={images[activeIndex]}
        alt={`${productName} — view ${activeIndex + 1} of ${images.length}`}
        className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-gray-700"
      />

      <div
        role="tablist"
        aria-label={`${productName} image gallery`}
        className="flex gap-2"
        onKeyDown={handleKeyDown}
      >
        {images.map((src, index) => (
          <button
            key={src}
            ref={(el) => (thumbnailRefs.current[index] = el)}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            tabIndex={index === activeIndex ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            className={`
              w-16 h-16 rounded-md overflow-hidden border-2 shrink-0
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
              ${
                index === activeIndex
                  ? 'border-blue-600'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}