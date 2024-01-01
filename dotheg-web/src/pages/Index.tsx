import { TypographyStylesProvider } from "@mantine/core";

const Index = () => {
  return (
    <TypographyStylesProvider p={0}>
      <h1>Diet on the Go 🥗✨</h1>

      <p>
        I'm thrilled to share my latest personal project, <strong>Diet on the Go</strong>, an application designed to make your fitness journey a breeze! 🏋️‍♂️
      </p>

      <h2>How It Works:</h2>

      <ol>
        <li>
          <strong>Basic Data Input:</strong> Users kickstart their journey by providing weight, height, and age.
        </li>
        <li>
          <strong>Calculating BMR:</strong> We employ the Harris-Benedict formula to calculate Basal Metabolic Rate (BMR), laying the foundation for personalized plans.
          <br />
          <code>BMR = 88.362 + (13.397 × weight) + (4.799 × height) - (5.677 × age)</code>
        </li>
        <li>
          <strong>Determining Maintenance Calories:</strong> Tailored maintenance calories calculated with user-specific activity levels using PAL factors.
        </li>
        <li>
          <strong>Setting Caloric Goals:</strong> Users can set goals, creating a calorie deficit or surplus based on their fitness aspirations.
        </li>
        <li>
          <strong>Macronutrient Division:</strong> Flexible macronutrient selection - protein, fat, and carbs - with detailed caloric breakdown.
          <br />
          <code>1g carb = 4 cal, 1g protein = 4 cal, 1g fat = 9 cal</code>
        </li>
        <li>
          <strong>Adding Food Items:</strong> Customize your diet plan by adding food items, each contributing to your total macronutrient intake.
        </li>
      </ol>

      <h2>Technologies Used:</h2>

      <ul>
        <li>
          <strong>Frontend:</strong> ReactJS, Mantine UI
        </li>
        <li>
          <strong>Backend:</strong> NestJS
        </li>
        <li>
          <strong>Database:</strong> SQLite
        </li>
        <li>
          <strong>Authentication:</strong> Google OAuth
        </li>
        <li>
          <strong>Server:</strong> Amazon EC2
        </li>
        <li>
          <strong>CI/CD:</strong> GitHub Actions
        </li>
      </ul>

      <h2>Contributors:</h2>

      <p>
        A big shoutout to Snehasish Mondal for contributing to this project! 🙌 <a href="test-link">Snehasish's GitHub</a>
      </p>
    </TypographyStylesProvider>
  );
};

export default Index;
