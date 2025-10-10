from dataclasses import dataclass


@dataclass(frozen=True)
class Action:
    target: str | None
