"""Server-side validation mirroring packages/validation (zod) so client + API agree."""
import re

from email_validator import EmailNotValidError, validate_email

from .errors import ApiError

_PW_LETTER = re.compile(r"[A-Za-z]")
_PW_DIGIT = re.compile(r"[0-9]")


def _require(data: dict, *keys: str) -> None:
    if not isinstance(data, dict):
        raise ApiError("invalid_request", "Expected a JSON body", 400)


def validate_register(data: dict) -> dict:
    _require(data)
    fields: dict[str, str] = {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if len(name) < 2:
        fields["name"] = "Name must be at least 2 characters"
    if len(name) > 60:
        fields["name"] = "Name is too long"

    try:
        email = validate_email(email, check_deliverability=False).normalized.lower()
    except EmailNotValidError:
        fields["email"] = "Enter a valid email address"

    if len(password) < 8:
        fields["password"] = "Password must be at least 8 characters"
    elif not _PW_LETTER.search(password) or not _PW_DIGIT.search(password):
        fields["password"] = "Password needs at least one letter and one number"

    if fields:
        raise ApiError("validation_error", "Please fix the highlighted fields", 422, fields)
    return {"name": name, "email": email, "password": password}


def validate_login(data: dict) -> dict:
    _require(data)
    fields: dict[str, str] = {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not email:
        fields["email"] = "Email is required"
    if not password:
        fields["password"] = "Password is required"
    if fields:
        raise ApiError("validation_error", "Please fix the highlighted fields", 422, fields)
    return {"email": email, "password": password}
