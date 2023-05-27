const LPV2Service = ({el}) => {
    return (
        <span className="lpv2-service">
            <span style={{textAlign: 'left'}}>
                <img className="lpv2-service-img" src={el.img} alt="" />
                <span className={"lpv2-service-title color-neon-" + el.color}> {el.title}</span>
            </span>
        </span>
    )
}

export default LPV2Service