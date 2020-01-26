export const HandleChanges = (cambios) =>
{
    return {
        type: "HANDLE_WARTICLE_CHANGES",
        data: cambios
    }
}

export const PreUploadImage = (cambios) =>
{
    return {
        type: "PREUP_WARTICLE_IMAGE",
        data: cambios
    }
}


export const ResetEditing = () =>
{
    return {
        type: "RESET_WARTICLE_EDIT"
    }
}
