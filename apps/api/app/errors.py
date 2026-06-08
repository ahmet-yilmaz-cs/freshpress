"""Consistent JSON error envelope: { error, message, fields? }."""
from flask import Flask, jsonify


class ApiError(Exception):
    def __init__(self, error: str, message: str, status: int = 400, fields=None):
        super().__init__(message)
        self.error = error
        self.message = message
        self.status = status
        self.fields = fields

    def to_response(self):
        body = {"error": self.error, "message": self.message}
        if self.fields:
            body["fields"] = self.fields
        return jsonify(body), self.status


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(ApiError)
    def handle_api_error(err: ApiError):
        return err.to_response()

    @app.errorhandler(404)
    def handle_404(_err):
        return jsonify({"error": "not_found", "message": "Resource not found"}), 404

    @app.errorhandler(405)
    def handle_405(_err):
        return jsonify({"error": "method_not_allowed", "message": "Method not allowed"}), 405

    @app.errorhandler(500)
    def handle_500(_err):
        return jsonify({"error": "server_error", "message": "Something went wrong"}), 500
