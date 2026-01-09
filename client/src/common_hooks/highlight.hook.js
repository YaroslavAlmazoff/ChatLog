import { useState } from "react"

const useHighlight = () => {
    const [colors] = useState([
        'color-neon-blue',
        'color-neon-orange',
        'color-neon-green',
        'color-neon-purple',
        'color-neon-pink',
        'color-neon-navy',
    ])
    const [shadows] = useState([
        'blue-text-glow',
        'orange-text-glow',
        'green-text-glow',
        'purple-text-glow',
        'pink-text-glow',
        'navy-text-glow',
    ])
    const [blockShadows] = useState([
        'blue-block-glow',
        'orange-block-glow',
        'green-block-glow',
        'purple-block-glow',
        'pink-block-glow',
        'navy-block-glow',
    ])

    const randomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)]
    }
    const randomShadow = () => {
        return shadows[Math.floor(Math.random() * shadows.length)]
    }
    const randomBlockShadow = () => {
        return blockShadows[Math.floor(Math.random() * blockShadows.length)]
    }
    return {randomColor, randomShadow, randomBlockShadow}
}

export default useHighlight