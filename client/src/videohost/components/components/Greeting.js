import useHighlight from "../../../common_hooks/highlight.hook"

const Greeting = () => {
const styles = {
    div: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: window.innerWidth > 500 ? 'flex-start' : 'center'
    },
    p: {
        color: 'white',
        fontSize: '16pt',
        fontWeight: '200',
        textAlign: window.innerWidth > 500 ? 'left' : 'center'
    }
}
    const {randomColor, randomShadow} = useHighlight() 

    return (
        <div style={styles.div}>
            <p style={styles.p} className={`${randomColor()} ${randomShadow()}`}>
                Добро пожаловать в ChatLog Видеоблогер, где Вы можете найти видеоконтент по видеоиграм и игровой индустрии
            </p>
        </div>
        
    )
}

export default Greeting