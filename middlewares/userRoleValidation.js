
const isAdmin = (req, res, next) => {
    if (!req.authenticatedUser) {
        return res.status(500).json({
            msg: 'Role cannot be evaluated before token is verified'
        });
    }

    const { role, name } = req.authenticatedUser;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: 'No Authorized. User must be admin'
        });
    }

    next();
}

const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!req.authenticatedUser) {
            return res.status(500).json({
                msg: 'Role cannot be evaluated before token is verified'
            });
        }

        if (!roles.includes(req.authenticatedUser.role)) {
            return res.status(401).json({
                msg: `No Authorized. User must have one of the following roles: ${roles}`
            })
        }

        next();
    }
}



module.exports = {
    isAdmin,
    hasRole
}