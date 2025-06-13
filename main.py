from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tutoring.db'  # SQLite database file
db = SQLAlchemy(app)

# Database Models
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    assignments = db.relationship('Assignment', backref='student', lazy=True)

class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    deadline = db.Column(db.DateTime, nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)

# Create tables (run once)
with app.app_context():
    db.create_all()

# API Routes
@app.route('/students', methods=['GET', 'POST'])
def handle_students():
    if request.method == 'GET':
        students = Student.query.all()
        return jsonify([{"id": s.id, "name": s.name, "email": s.email} for s in students])
    elif request.method == 'POST':
        data = request.json
        new_student = Student(name=data['name'], email=data['email'])
        db.session.add(new_student)
        db.session.commit()
        return jsonify({"message": "Student created!"}), 201

@app.route('/assignments', methods=['POST'])
def create_assignment():
    data = request.json
    deadline = datetime.strptime(data['deadline'], '%Y-%m-%d %H:%M:%S')  # Format: "2024-12-31 23:59:59"
    new_assignment = Assignment(
        title=data['title'],
        deadline=deadline,
        student_id=data['student_id']
    )
    db.session.add(new_assignment)
    db.session.commit()
    return jsonify({"message": "Assignment added!"}), 201

if __name__ == '__main__':
    app.run(debug=True)  # Run on http://localhost:5000