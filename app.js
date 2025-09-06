import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3000;


// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Static files
app.use(express.static(path.join(__dirname, 'public')));


// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Home page
app.get('/', (req, res) => {
res.render('index');
});


// Sanitizes AI output if it comes wrapped in ```html ... ``` fences
function stripCodeFences(s = '') {
return s.replace(/^\s*```(?:html)?/i, '').replace(/```\s*$/, '').trim();
}


// Build the system prompt to force single-file HTML with inline CSS/JS
function buildSystemPrompt() {
return [
'You are an expert front-end generator.',
'Return ONLY a single valid HTML document.',
'All CSS must be inside <style> and all JS inside <script> in the same file.',
'No external CSS/JS links (except optional Google Fonts).',
'Do NOT include triple backticks or explanations—just the HTML.',
].join(' ');
}


// POST /generate → call OpenRouter, render result.ejs
app.post('/generate', async (req, res) => {
});