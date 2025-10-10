from getpass import getpass


class PassphraseException(Exception):
    pass


def confirm_passphrase(passphrase: str):
    confirm = getpass("Confirm the passphrase for the encrypted SQLite file: ")
    if confirm != passphrase:
        raise PassphraseException("Passphrases do not match")


def get_passphrase() -> str:
    return getpass("Enter passphrase for the encrypted SQLite file: ")
