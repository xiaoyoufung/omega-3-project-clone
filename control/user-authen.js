const listUser = require('../model/listUser');


module.exports.userAuthentication = async (req, res, next) => {

    try {
        // get logged in sessionID
        const loginSession = req.sessionID;
        const isAdminSession = req.session.isAdmin;

        // get logged in user's username from session
        const session_username = req.session.user.username;
        console.log(isAdminSession);
        if (!loginSession) {
            return res.redirect('/login?q=session-expired');
        }

        // check if username & password in session is match with 
        const username = await listUser.findAllByKey('user_name', session_username);
        if (!username || isAdminSession) {
            return res.redirect('/login?q=session-expired');
        }
        next();
    } catch (err) {
        console.log(err);
        //res.json({ msg: 'Server error. Please reload page after sometime' });
        res.redirect('/login');
    }
};


module.exports.adminAuthentication = async (req, res, next) => {


    // const session_password = req.session.user.password;

    // check if found username and password
    // if (!session_username || !session_password) {
    //     return res.redirect('/login?q=session-expired');
    // }

    try {
        // get logged in sessionID
        const loginSession = req.sessionID;
        const isAdminSession = req.session.isAdmin;

        // get logged in user's username from session
        const session_username = req.session.user.username;
        
        if (!loginSession) {
            return res.redirect('/login?q=session-expired');
        }

        // check if username & password in session is match with 
        const username = await listUser.findAllByKey('user_name', session_username);
        if (!username || !isAdminSession) {
            return res.redirect('/login?q=session-expired');
        }
        next();
    } catch (err) {
        console.log(err);
        //res.json({ msg: 'Server error. Please reload page after sometime' });
        res.redirect('/login');
    }
};