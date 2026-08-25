let date = new Date()

const getMonth = () => {
    const month = date.getMonth()
    if(month === 0) {
        return {
            string: 'январь',
            is31: true,
            next: () => {
                return 'февраль'
            }
        }
    } else if(month === 1) {
        return {
            string: 'февраль',
            next: () => {
                return 'март'
            }
        }
    } else if(month === 2) {
        return {
            string: 'март',
            is31: true,
            next: () => {
                return 'апрель'
            }
        }
    } else if(month === 3) {
        return {
            string: 'апрель',
            next: () => {
                return 'май'
            }
        }
    } else if(month === 4) {
        return {
            string: 'май',
            is31: true,
            next: () => {
                return 'июнь'
            }
        }
    } else if(month === 5) {
        return {
            string: 'июнь',
            next: () => {
                return 'июль'
            }
        }
    } else if(month === 6) {
        return {
            string: 'июль',
            is31: true,
            next: () => {
                return 'август'
            }
        }
    } else if(month === 7) {
        return {
            string: 'август',
            next: () => {
                return 'сентябрь'
            }
        }
    } else if(month === 8) {
        return {
            string: 'сентябрь',
            next: () => {
                return 'октябрь'
            }
        }
    } else if(month === 9) {
        return {
            string: 'октябрь',
            is31: true,
            next: () => {
                return 'ноябрь'
            }
        }
    } else if(month === 10) {
        return {
            string: 'ноябрь',
            next: () => {
                return 'декабрь'
            }
        }
    }
    else if(month === 11) {
        return {
            string: 'декабрь',
            is31: true,
            next: () => {
                return 'январь'
            }
        }
    }
}

const is31 = (month) => {
    if(month == 'январь') {
        return 31
    } else if(month == 'февраль') {
        return 28
    } else if(month == 'март') {
        return 31
    } else if(month == 'апрель') {
        return 30
    } else if(month == 'май') {
        return 31
    } else if(month == 'июнь') {
        return 30
    } else if(month == 'июль') {
        return 31
    } else if(month == 'август') {
        return 31
    } else if(month == 'сентябрь') {
        return 30
    } else if(month == 'октябрь') {
        return 31
    } else if(month == 'ноябрь') {
        return 30
    } else if(month == 'декабрь') {
        return 31
    }
}

module.exports = {getMonth, is31}