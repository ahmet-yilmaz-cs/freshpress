"""Mock device + recipe data so the app's Device Control / Explore screens are consistent."""
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

bp = Blueprint("devices", __name__)

# Mirrors the Device Control Figma frame.
DEVICE = {
    "id": "jl-pro-x1-127325",
    "name": "JuiceLab Pro X1",
    "series": "PREMIUM SERIES",
    "connected": True,
    "battery": 82,
    "status": "ready",
    "speed": "medium",
    "yieldMl": 450,
    "capacityPct": 75,
}

RECIPES = [
    {
        "id": "morning-smoothie",
        "title": "Morning Smoothie",
        "imageUrl": "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800",
        "calories": 180,
        "durationSec": 192,
        "ingredients": ["Apple", "Carrot", "Ginger"],
    },
    {
        "id": "green-detox",
        "title": "Green Detox",
        "imageUrl": "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800",
        "calories": 120,
        "durationSec": 300,
        "ingredients": ["Spinach", "Cucumber", "Lemon", "Celery"],
    },
    {
        "id": "vitamin-c",
        "title": "Vitamin C Boost",
        "imageUrl": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800",
        "calories": 150,
        "durationSec": 150,
        "ingredients": ["Orange", "Grapefruit", "Turmeric"],
    },
    {
        "id": "beet-mix",
        "title": "Beet Mix",
        "imageUrl": "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=800",
        "calories": 200,
        "durationSec": 280,
        "ingredients": ["Beetroot", "Apple", "Carrot"],
    },
]


@bp.get("/device")
@jwt_required()
def device():
    return jsonify({"device": DEVICE})


@bp.get("/recipes")
@jwt_required()
def recipes():
    return jsonify({"recipes": RECIPES})
