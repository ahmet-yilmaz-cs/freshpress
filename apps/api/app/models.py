import uuid
from datetime import datetime, timezone

from werkzeug.security import check_password_hash, generate_password_hash

from .db import db


def _uuid() -> str:
    return uuid.uuid4().hex


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(32), primary_key=True, default=_uuid)
    name = db.Column(db.String(60), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def set_password(self, raw: str) -> None:
        # pbkdf2 (not scrypt) for portability across Python/OpenSSL builds.
        self.password_hash = generate_password_hash(raw, method="pbkdf2:sha256")

    def check_password(self, raw: str) -> bool:
        return check_password_hash(self.password_hash, raw)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "createdAt": (self.created_at or datetime.now(timezone.utc)).isoformat(),
        }
