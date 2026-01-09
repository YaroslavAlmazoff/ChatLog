const request = require("request")
const config = require("config")
const {IP2Location} = require("ip2location-nodejs")

class MobileService {
    translit(req, res) {
        var word = req.params.word
        var answer = '';
        var converter = {
            'а': 'a',    'б': 'b',    'в': 'v',    'г': 'g',    'д': 'd',
            'е': 'e',    'ё': 'e',    'ж': 'zh',   'з': 'z',    'и': 'i',
            'й': 'y',    'к': 'k',    'л': 'l',    'м': 'm',    'н': 'n',
            'о': 'o',    'п': 'p',    'р': 'r',    'с': 's',    'т': 't',
            'у': 'u',    'ф': 'f',    'х': 'h',    'ц': 'c',    'ч': 'ch',
            'ш': 'sh',   'щ': 'sch',  'ь': '',     'ы': 'y',    'ъ': '',
            'э': 'e',    'ю': 'yu',   'я': 'ya',
     
            'А': 'A',    'Б': 'B',    'В': 'V',    'Г': 'G',    'Д': 'D',
            'Е': 'E',    'Ё': 'E',    'Ж': 'Zh',   'З': 'Z',    'И': 'I',
            'Й': 'Y',    'К': 'K',    'Л': 'L',    'М': 'M',    'Н': 'N',
            'О': 'O',    'П': 'P',    'Р': 'R',    'С': 'S',    'Т': 'T',
            'У': 'U',    'Ф': 'F',    'Х': 'H',    'Ц': 'C',    'Ч': 'Ch',
            'Ш': 'Sh',   'Щ': 'Sch',  'Ь': '',     'Ы': 'Y',    'Ъ': '',
            'Э': 'E',    'Ю': 'Yu',   'Я': 'Ya'
        };
     
        for (var i = 0; i < word.length; ++i ) {
            if (converter[word[i]] == undefined){
                answer += word[i];
            } else {
                answer += converter[word[i]];
            }
        }
     
        res.json({message: answer})
    }
    async getWeather(req, res) {
        const URL = `https://api.openweathermap.org/data/2.5/weather?q=${this.translit(req.params.city)},RU&units=metric&lang=ru&APPID=${config.get("WEATHER_API_KEY")}`
        const weather = request(URL)
        console.log(weather)
        res.json(weather)
    }
    async getForecast(req, res) {
        console.log(req.ip)
        let ip = req.ip.replace("::", "").split(":")[1]
        if(ip.split('.')[0] > 99) {
            ip = "1." + req.ip.split('.')[1] + "." + req.ip.split('.')[2] + "." + req.ip.split('.')[3]
        } else {
            ip = req.ip
        }
        console.log(ip)
        let ip2location = new IP2Location()
        ip2location.open("../sample.bin.db1/SAMPLE.BIN")
        let result = ip2location.getAll(ip)
        res.json({latitude: result.latitude, longitude: result.longitude, result})
    }
}

module.exports = new MobileService()