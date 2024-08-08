import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyDM5AEvY80Dbj1Jlnw_d33ythe6LpmV4fw',
  authDomain: 'expense-tracker-fe957.firebaseapp.com',
  databaseURL: 'https://expense-tracker-fe957-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'expense-tracker-fe957',
  storageBucket: 'expense-tracker-fe957.appspot.com',
  messagingSenderId: '1066553464278',
  appId: '1:1066553464278:web:49355ee5c09a797fa10077',
};

firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export const db = firebase.firestore();
export const categoriesCollection = db.collection('categories');
export const expensesCollection = db.collection('expenses');

export const auth = firebase.auth();

export const registerUser = async (email, password) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    await categoriesCollection.doc(user.uid).collection('categories').doc('groceries').set({});
    await categoriesCollection.doc(user.uid).collection('categories').doc('rent').set({});
    await categoriesCollection.doc(user.uid).collection('categories').doc('utilities').set({});
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      throw new Error('Invalid login credentials. Please register if you do not have an account.');
    } else {
      console.error('Error logging in:', error);
      throw error;
    }
  }
};

// Logout the current user
export const logoutUser = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Subscribe to authentication state changes
export const subscribeToAuthStateChanges = (callback) => {
  return auth.onAuthStateChanged(callback);
};

// Get the currently authenticated user
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};
export const fetchCategories = async (userId) => {
  try {
    const categoriesSnapshot = await categoriesCollection.doc(userId).collection('categories').get();
    return categoriesSnapshot.docs.map((doc) => doc.id);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
