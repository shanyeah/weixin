import dva from 'dva';
import createLoading from 'dva-loading';
import './index.css';
import './index.less';
import router from './router';

// 1. Initialize
const app = dva();

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/TipsModel'));

// 4. Router
app.router(router);

// 5. Start
app.start('#root');
