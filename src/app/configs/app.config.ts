import { AppConfig } from '@app/shared/types/app-config.interface';
import { defaultLanguge } from './i18n.config'
import { environment } from 'src/environments/environment';

export const AppConfiguration : AppConfig = {
    layoutType: 'vertical',
    sideNavCollapse: false,
    mobileNavCollapse: false,
    lang: defaultLanguge,
    navMenuColor: 'light',
    headerNavColor: '#ffffff'
}

// Change your API endpoint here
export const API_ENDPOINT = environment.apiUrl
