export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email)
}

export const getInitials = (name) => {
    if(!name) return "";
    const words = name.split(" ")
    let intitals = "";
    for(let i = 0; i < Math.min(words.length, 2); i++){
        intitals += words[i][0];
    }
    return intitals.toUpperCase();
}