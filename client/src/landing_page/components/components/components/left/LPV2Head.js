import LPV2Button from "./LPV2Button"

const LPV2Head = () => {

    return (
        <div className="lpv2-block">   
            <div id="fountainTextG">
                <div id="fountainTextG_1" class="fountainTextG">C</div>
                <div id="fountainTextG_2" class="fountainTextG">H</div>
                <div id="fountainTextG_3" class="fountainTextG">A</div>
                <div id="fountainTextG_4" class="fountainTextG">T</div>
                <div id="fountainTextG_5" class="fountainTextG">L</div>
                <div id="fountainTextG_6" class="fountainTextG">O</div>
                <div id="fountainTextG_7" class="fountainTextG">G</div>
            </div>
            <div className="lpv2-buttons">
                <LPV2Button text="Зарегистрироваться" link="/register" />
                <LPV2Button text="Войти" link="/login" />   
                <a className="button" href={process.env.REACT_APP_API_URL + '/gamedownloads/63b5e40a09fd3ea66ba884a5'} download="ChatLog">Скачать приложение</a>  
            </div>
        </div>
    )
}

export default LPV2Head