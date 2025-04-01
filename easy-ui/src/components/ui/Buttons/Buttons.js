import React from "react";
import ListItem from "../List-item";

function Buttons() {
  const buttonData = [
    {
      id: 1,
      name: "Primary Button",
      buttonClass: "btn-primary",
      html: "<button class='btn-primary'>Primary Button</button>",
      css: `
        .btn-primary {
          background-color: blue;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `,
    },
    {
      id: 2,
      name: "Secondary Button",
      buttonClass: "btn-secondary",
      html: "<button class='btn-secondary'>Secondary Button</button>",
      css: `
        .btn-secondary {
          background-color: gray;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `,
    },
    {
      id: 3,
      name: "Success Button",
      buttonClass: "btn-success",
      html: "<button class='btn-success'>Success Button</button>",
      css: `
        .btn-success {
          background-color: green;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `,
    },
    {
      id: 4,
      name: "Danger Button",
      buttonClass: "btn-danger",
      html: "<button class='btn-danger'>Danger Button</button>",
      css: `
        .btn-danger {
          background-color: red;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `,
    },
    {
      id: 5,
      name: "Warning Button",
      buttonClass: "btn-warning",
      html: "<button class='btn-warning'>Warning Button</button>",
      css: `
        .btn-warning {
          background-color: orange;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `,
    },
  ];

  return <ListItem items={buttonData} />;
}

export default Buttons;
