export const supportedLanguages = {
    en_US: 'English',
    fr_FR: 'French',
    ar_AR: 'Arabic',
}

export const defaultLanguge = localStorage.getItem('lang') ||  Object.keys(supportedLanguages)[1]
