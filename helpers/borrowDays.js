module.exports = (today, borrowed_day) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((today - borrowed_day) / oneDay));;
}

