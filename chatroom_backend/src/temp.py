from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Set the upload folder and allowed file extensions
app.config['UPLOAD_FOLDER'] = './uploads'
app.config['ALLOWED_EXTENSIONS'] = {'mp4', 'mov', 'avi'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/upload', methods=['POST', 'GET'])
def upload_file():
    if request.method=='GET':
         print("INITIAL TEST")
         return jsonify({'message': 'GET success'}), 200

    else:
        print("uploading")
        if 'video' not in request.files:
            print("no file part")
            return jsonify({'error': 'No file part'}), 400
        file = request.files['video']
        if file.filename == '':
            print("no selected file")
            return jsonify({'error': 'No selected file'}), 400
        if file and allowed_file(file.filename):
            filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(filename)
            print("uploaded successs")
            return jsonify({'message': 'File uploaded successfully', 'filename': file.filename}), 200
        else:
            return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
