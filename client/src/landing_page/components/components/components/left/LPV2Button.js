const LPV2Button = ({text, link}) => {
    const goTo = () => {
        window.location = link
    }
    return (
        <button className="lpv2-button" onClick={goTo}>{text}</button>
    )
}

export default LPV2Button