const NoChannels = ({channels}) => {

    return (
        <>{ !channels.length &&
        <div>
            <p style={{color: 'white', fontSize: '14pt'}}>Здесь пока нет каналов</p>
        </div>}
        </>
    )
}

export default NoChannels