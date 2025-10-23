import {useEffect, useState} from "react";

type ItemPostSetter<Type> = (itemPost: Type) => void
export type ItemPostFieldSetter<Type> = <Key extends keyof Type>(field: Key, value: Type[Key]) => void
export type ItemPostFieldGetter<Type> = <Key extends keyof Type>(field: Key) => Type[Key] | undefined
export type ConstrainedItemPostFieldSetter<Type, Key extends keyof Type, Value> = (field: Key, value: Value) => void
export type ConstrainedItemPostFieldGetter<Type, Key extends keyof Type, Value> = (field: Key) => Value | undefined

export function useItemPost<Type extends {}>(): {
    itemPost?: Type,
    setItemPost: ItemPostSetter<Type>,
    getItemPostField: ItemPostFieldGetter<Type>,
    setItemPostField: ItemPostFieldSetter<Type>,
} {
    const [itemPost, setItemPost] = useState<Type>()
    const inactiveGetItemPostField: ItemPostFieldGetter<Type> = () => undefined
    const [getItemPostField, setGetItemPostField] = useState<ItemPostFieldGetter<Type>>(() => inactiveGetItemPostField)
    const inactiveSetItemPostField: ItemPostFieldSetter<Type> = () => {
    }
    const [setItemPostField, setSetItemPostField] = useState<ItemPostFieldSetter<Type>>(() => inactiveSetItemPostField)

    useEffect(() => {
        if (itemPost !== undefined) {
            const activeGetItemPostField: ItemPostFieldGetter<Type> = (field) => itemPost[field]
            const activeSetItemPostField: ItemPostFieldSetter<Type> = (field, value) => setItemPost({
                ...itemPost,
                [field]: value
            })
            setGetItemPostField(() => activeGetItemPostField)
            setSetItemPostField(() => activeSetItemPostField)
        } else {
            setGetItemPostField(() => inactiveGetItemPostField)
            setSetItemPostField(() => inactiveSetItemPostField)
        }
    }, [itemPost]);

    return {itemPost, setItemPost, getItemPostField, setItemPostField}
}
