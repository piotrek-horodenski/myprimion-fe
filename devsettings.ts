import fs from 'fs-extra'
import { defualtSettings } from './src/stores/default-settings'

fs.writeJSONSync('./public/settings.json', defualtSettings, { spaces: 2 })