
import cv2
import mediapipe as mp
import base64
import numpy as np
import time
from playsound import playsound
import os
from collections import deque
from plyer import notification
import threading

last_sound_time = 0  # Variable to store the last time the sound was played
sound_interval = 180



# Mediapipe initialization
mp_pose = mp.solutions.pose
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, min_detection_confidence=0.5)

# Initialize variables for blink detection
previous_blink_state = False
blink_count = 0
blink_history = []
blink_smooth_window = deque(maxlen=5)  # Moving average for blink detection

# Lighting condition variables
# brightness_threshold = 200  # Adjust this based on your environment
# low_light_notification_sent = False

# Variables for angle-based posture detection and calibration
is_calibrated = False
calibration_frames = 0
calibration_shoulder_angles = []
calibration_neck_angles = []
shoulder_threshold = None
neck_threshold = None
posture_smooth_window = deque(maxlen=5)  # Moving average for posture detection
last_alert_time = time.time()
alert_cooldown = 10  # seconds

sound_file = "music.mp3"  # Path to your sound file

brightness_threshold = 150  # Example threshold for low light
low_light_notification_sent = False
last_notification_time = time.time()
notification_interval = 300  # Notification interval in seconds (5 minutes)

# Increase the number of frames for calibration to increase stability
calibration_frames_target = 50  # Increase calibration frames from 30 to 50


# def play_sound_in_thread(sound_file):
#     threading.Thread(target=playsound, args=(sound_file,), daemon=True).start()
def play_sound_in_thread(sound_file):
    try:
        # Check if the file exists first to prevent errors
        if os.path.exists(sound_file):
            # Start the sound in a new thread
            threading.Thread(target=playsound, args=(sound_file,), daemon=True).start()
        else:
            print(f"Sound file {sound_file} not found.")
    except Exception as e:
        print(f"Error playing sound: {e}")

# Function to check lighting condition and send desktop notification
def check_lighting_condition(frame):
    global low_light_notification_sent, last_notification_time
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    brightness = np.mean(gray)
    
    # Print brightness level to terminal
    # print(f"Current brightness level: {brightness}")
    
    # Check for low lighting condition
    if brightness < brightness_threshold:
        current_time = time.time()
        if not low_light_notification_sent or (current_time - last_notification_time >= notification_interval):
            # Send desktop notification
            notification.notify(
                title="Lighting Condition Alert",
                message="Inadequate lighting detected. Please increase lighting for accurate detection.",
                app_name="Posture and Blink Detection",
                timeout=10  # Notification duration
            )
            last_notification_time = current_time
            low_light_notification_sent = True
        return False
    
    # Reset notification status if lighting is adequate
    low_light_notification_sent = False
    return True

# Function to calculate the angle between three points
def calculate_angle(point1, point2, point3):
    a = np.array(point1)
    b = np.array(point2)
    c = np.array(point3)
    
    ba = a - b
    bc = c - b
    
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    angle = np.degrees(np.arccos(cosine_angle))
    
    return angle

# Function to draw angles on the frame
def draw_angle(frame, point1, point2, point3, angle, color):
    cv2.putText(frame, str(int(angle)), 
                tuple(np.add(point2, (10, -10)).astype(int)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2, cv2.LINE_AA)

    
def analyze_posture(frame, landmarks):
    global is_calibrated, calibration_frames, shoulder_threshold, neck_threshold, last_alert_time, last_sound_time

    # Extract key landmarks
    left_shoulder = (int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].x * frame.shape[1]),
                     int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].y * frame.shape[0]))
    right_shoulder = (int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].x * frame.shape[1]),
                      int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].y * frame.shape[0]))
    left_ear = (int(landmarks[mp_pose.PoseLandmark.LEFT_EAR].x * frame.shape[1]),
                int(landmarks[mp_pose.PoseLandmark.LEFT_EAR].y * frame.shape[0]))

    # Calculate shoulder and neck angles more precisely
    shoulder_angle = calculate_angle(left_shoulder, right_shoulder, (right_shoulder[0], right_shoulder[1] - 100))
    neck_angle = calculate_angle(left_ear, left_shoulder, (left_shoulder[0], left_shoulder[1] - 100))

    # Calibration process with more frames for accuracy
    if not is_calibrated and calibration_frames < calibration_frames_target:
        calibration_shoulder_angles.append(shoulder_angle)
        calibration_neck_angles.append(neck_angle)
        calibration_frames += 1
        return f"Calibrating... {calibration_frames}/{calibration_frames_target}", (255, 255, 0)
    
    # Perform calibration after enough frames
    if not is_calibrated:
        shoulder_threshold = np.mean(calibration_shoulder_angles) - 5  # Reduced threshold for accuracy
        neck_threshold = np.mean(calibration_neck_angles) - 5
        is_calibrated = True
        print(f"Calibration complete. Shoulder threshold: {shoulder_threshold:.1f}, Neck threshold: {neck_threshold:.1f}")

    # Add angles to smoothing window for stability
    posture_smooth_window.append((shoulder_angle, neck_angle))
    if len(posture_smooth_window) > 10:  # Keep a reasonable window size for smoothing
        posture_smooth_window.pop(0)

    # Apply moving average for smoother values
    smooth_shoulder_angle = np.mean([angle[0] for angle in posture_smooth_window])
    smooth_neck_angle = np.mean([angle[1] for angle in posture_smooth_window])

    # Get the current time for time-based events
    current_time = time.time()

    # Check for poor posture condition and sound playback
    if smooth_shoulder_angle < shoulder_threshold or smooth_neck_angle < neck_threshold:
        if current_time - last_alert_time > alert_cooldown:
            print("Poor posture detected! Please sit up straight.")
            
            # Check if the sound file exists and the time interval has passed
            if os.path.exists(sound_file):
                if current_time - last_sound_time >= sound_interval:  # Only play after 5 minutes
                    last_sound_time = current_time  # Update the last sound time
                    play_sound_in_thread(sound_file)  # Play sound in a separate thread

        return "Poor Posture", (0, 0, 255)  # Red for bad posture
    else:
        return "Good Posture", (0, 255, 0)  # Green for good posture
    

# Function to analyze focus (blink detection) with enhanced precision
def analyze_focus(frame):
    global previous_blink_state, blink_count, blink_history
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = face_mesh.process(rgb_frame)

    if result.multi_face_landmarks:
        for face_landmarks in result.multi_face_landmarks:
            left_eye_top = face_landmarks.landmark[159]
            left_eye_bottom = face_landmarks.landmark[145]
            right_eye_top = face_landmarks.landmark[386]
            right_eye_bottom = face_landmarks.landmark[374]

            left_eye_distance = abs(left_eye_top.y - left_eye_bottom.y)
            right_eye_distance = abs(right_eye_top.y - right_eye_bottom.y)
            eye_open_threshold = 0.02  # Adjust threshold for blink detection

            # Average both eyes for more accurate blink detection
            avg_eye_distance = (left_eye_distance + right_eye_distance) / 2

            # Apply moving average to smooth the blink detection
            blink_smooth_window.append(avg_eye_distance)
            if len(blink_smooth_window) > 5:  # Smaller window size for blink smoothness
                blink_smooth_window.pop(0)
            smooth_eye_distance = np.mean(blink_smooth_window)

            # Check for blink with adjusted thresholds and states
            if smooth_eye_distance < eye_open_threshold:
                if not previous_blink_state:  # Blink detected
                    blink_count += 1  # Increment the blink count
                    previous_blink_state = True
                    blink_history.append(time.time())  # Log blink time
            else:
                previous_blink_state = False  # Reset blink state when eyes are open

    # Keep only blinks from the last minute for focus calculation
    current_time = time.time()
    blink_history = [t for t in blink_history if current_time - t < 60]  # Only keep blinks from the last minute

    return blink_count  # Return the total blink count, which should never decrease



# Generate video frames
def generate_frame():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Camera could not be opened.")
        return

    global blink_count  # Use global blink_count to keep track across frames
    blink_count = 0  # Initialize blink count
    posture_status = "Unknown"  # Initialize posture status

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to capture frame.")
            break

        # Check lighting and print brightness level
        check_lighting_condition(frame)

        # Convert frame to RGB for pose detection
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_frame)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            # Analyze posture
            posture_status, posture_color = analyze_posture(frame, landmarks)
            
            # Analyze focus (blink detection)
            blink_count = analyze_focus(frame)

            # Draw the pose landmarks and angles
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            cv2.putText(frame, posture_status, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, posture_color, 2, cv2.LINE_AA)
            cv2.putText(frame, f"Blinks: {blink_count}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

        # Encode the frame to JPEG and then to base64
        _, buffer = cv2.imencode('.jpg', frame)
        frame_encoded = base64.b64encode(buffer).decode('utf-8')

        # Yield the encoded frame, posture status, and blink count
        yield frame_encoded, posture_status, blink_count
    
    cap.release()
