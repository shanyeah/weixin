// 提示Model

export default {
    namespace: 'tips',
    state: {
        msg: "",
        msgType: 0,
        timestamp: 0
    },
    reducers: {
        save(state, { payload: { data: msg, msgType, timestamp } }) {
            return { ...state, msg, msgType, timestamp };
        },
    },
    effects: {
        // msgType:1 普通消息 0:错误消息
        *handleMsg({ payload: { msg } }, { call, put }) {
            
            let message = msg + "";

            yield put({
                type: 'save',
                payload: {
                    data: message,
                    msgType: 1
                },
            });
        },
        *handleErrorMsg({ payload: { msg } }, { call, put }) {
            var date = new Date();
            let message = msg + "";
            if (message.indexOf('Failed to fetch') > 0) {
                message = "网络异常,请稍候再试!";
            }
            yield put({
                type: 'save',
                payload: {
                    data: message,
                    msgType: 0,
                    timestamp: date.getMilliseconds()
                },
            });
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                
            });
        },
    },
};
