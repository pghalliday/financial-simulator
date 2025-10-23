import {useCallback, useEffect, useState} from "react";
import _ from "lodash";

export type ItemPostSetter<Type> = (itemPost: Partial<Type>) => void
export type ItemPostSubmitter<Type> = (itemPost: Type) => void
export type ItemPostValidator<Type> = (itemPost: Partial<Type>) => Type | undefined
export type ItemPostFieldSetter<Type> = <Key extends keyof Type>(field: Key, value: Partial<Type>[Key]) => void
export type ItemPostFieldGetter<Type> = <Key extends keyof Type>(field: Key) => Partial<Type>[Key]
export type ConstrainedItemPostFieldSetter<Type, Key extends keyof Type, Value> = (field: Key, value: Value | undefined) => void
export type ConstrainedItemPostFieldGetter<Type, Key extends keyof Type, Value> = (field: Key) => Value | undefined

export function useItemPost<Type extends {}>(
    onValidate: ItemPostValidator<Type>,
    onSubmit: ItemPostSubmitter<Type>,
): {
    setItemPost: ItemPostSetter<Type>,
    getField: ItemPostFieldGetter<Type>,
    setField: ItemPostFieldSetter<Type>,
    valid: boolean,
    modified: boolean,
    revert: () => void,
    submit: () => void,
} {
    const [itemPost, setItemPost] = useState<Partial<Type>>({})
    const [modifiedItemPost, setModifiedItemPost] = useState<Partial<Type>>(itemPost)
    const [modified, setModified] = useState(false)
    const [valid, setValid] = useState(onValidate(modifiedItemPost) !== undefined)

    useEffect(() => {
        setModifiedItemPost({...itemPost})
    }, [itemPost]);

    const revert = useCallback(() => {
        setModifiedItemPost({...itemPost})
    }, [itemPost])

    const submit = useCallback(() => {
        const validItemPost = onValidate(modifiedItemPost)
        if (validItemPost != undefined) {
            onSubmit(validItemPost)
        }
    }, [modifiedItemPost])

    const getField = useCallback<ItemPostFieldGetter<Type>>(field => {
        return modifiedItemPost[field]
    }, [modifiedItemPost])

    const check = useCallback(() => {
        setModified(!_.isEqual(itemPost, modifiedItemPost))
        setValid(onValidate(modifiedItemPost) !== undefined)
    }, [modifiedItemPost])

    const setField = useCallback<ItemPostFieldSetter<Type>>((field, value) => {
        modifiedItemPost[field] = value
        check()
    }, [check])

    useEffect(() => {
        check()
    }, [check]);

    return {setItemPost, getField, setField, valid, modified, revert, submit}
}
