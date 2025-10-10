from typing import Any


def aio_id_creator(component: str, sub_component: str):
    def creator(aio_id: Any):
        return {
            "component": component,
            "sub_component": sub_component,
            "aio_id": aio_id,
        }

    return creator
