const httpResponse = {
    onUserNotFound: {
        success: true,
        message: 'User not found.'
    },
    onRoleNotDeleted: {
        success: false,
        message: 'Default role cannot be deleted.'
    },
    onPermissionUnset: {
        success: true,
        message: 'the permission has been unset.'
    },
    onRolePermissionNotFound: {
        success: true,
        message: 'Role\'s permissions not found.'
    },
    onDateWrong: {
        success: false,
        message: 'The date format is wrong.'
    },
    validateResult: function (result, obj) {
        const resultArr = result[0];
        if (!resultArr.length) {
            if (obj) return obj;
            return this.onUserNotFound;
        }
        return resultArr
    }
}


module.exports = httpResponse;