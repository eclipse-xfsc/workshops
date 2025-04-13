# Gaia-X Portal (ORCE Flow)

## Overview
This ORCE flow provides a **front-end** and **back-end** implementation of a simplified Gaia-X style portal. It showcases how to:
 
- Navigate through a multi-step “wizard” (front-end) to gather user inputs, decode SD-JWT credentials, verify them, and ultimately call a secure endpoint (back-end).  
- Communicate with external services (catalogue APIs, wallet APIs, etc.) to fetch, transform, and display data.

> **Note**: Instead of installing ORCE directly, we recommend using the [XFSC Orchestration Engine (ORCE)](https://gitlab.eclipse.org/eclipse/xfsc/orce) environment. You can import these flows into ORCE, which provides ORCE integration and additional tooling for orchestration.

---

## Table of Contents
1. [Architecture](#architecture)  
2. [Usage in ORCE](#usage-in-orce)
   1. [Deployment](#deployment)  
   2. [Import This Flow](#import-this-flow)  
   3. [Deploy and Run](#deploy-and-run)  
   4. [Wizard Navigation](#wizard-navigation)  
3. [Flow Breakdown](#flow-breakdown)  
3. [Flow Breakdown](#flow-breakdown)  
   1. [Frontend Nodes/Groups](#frontend-nodesgroups)  
   2. [Backend Nodes/Groups](#backend-nodesgroups)  
   3. [Subflows](#subflows)  
4. [Detailed Step-by-Step Explanation](#detailed-step-by-step-explanation)  
   1. [Step 1 (Welcome)](#step-1-welcome)  
   2. [Step 2 (Table Data)](#step-2-table-data)  
   3. [Step 3 (Decoder)](#step-3-decoder)  
   4. [Step 4 (Result)](#step-4-result)  
   5. [Step 5 (Final Step)](#step-5-final-step)  
5. [Further Customization](#further-customization)  
6. [License](#license)  
7. [Final Notes](#final-notes)

---

## Architecture


      [Front-End (ORCE UI & uibuilder)]       [Back-End (Logic & HTTP Requests)]
                       |                                         |
           (Browser)   |  <---- ORCE Flow ---->   |   (External Services/APIs)
                       |                                         |

# Gaia-X Portal (ORCE Flow)

## Front-End

- **Employs `uibuilder`** for a web-based interface.  
- **Incorporates Gaia-X style UI nodes** (`GXUI Header`, `GXUI Footer`, `Data_Set`, `Label`) to manage layout, steps, and user input.  
- **Implements a step-based wizard** that guides the user through different phases.

![FrontEndFlows](images/frontendflow.png)

## Back-End

- **Reacts to events** from the UI (e.g., decode SD-JWT, call an external API, fetch data).  
- **Communicates with external endpoints** (catalogue, wallet, etc.).  
- **Uses subflows** and function nodes to transform data between front-end and back-end.

![BackEndFlows](images/backendflow.png)
---

## Usage in ORCE

## Deployment

### Prerequisites

- ORCE installed (version >= 2.x).
- Access to the ORCE editor.
- Required ORCE nodes installed via `npm` or the ORCE palette manager.

### Steps

1. Clone this repository:

   ```bash
   git clone https://github.com/your-repo/node-red-flow-workshop.git
  
   ```

2. Pull the Docker Image:

   Pull the latest Docker image from Docker Hub:

   ```bash
   docker pull leanea/xfsc-orce:1.0.0
   ```

3. Run the Container:

   Start your container using:

   ```bash
   docker run -d --name xfsc-orce-instance -p 1880:1880 leanea/xfsc-orce:1.0.0
   ```

4. Verify Installation:

   After running the container, verify that it is working correctly:

   ```bash
   docker logs xfsc-orce-instance
   ```

5. Launch URL:

   Access the ORCE interface:

   ```
   http://localhost:1880
   ```

   Use the following credentials to log in:

   ```bash
   Username: admin
   Password: xfsc-orce
   ```

## Import This Flow

   - Within the ORCE environment, open the main menu → **Import** → **Clipboard**.
   - You can find fullapp.json in the /flows folder.
   - Click **Import**.

## Deploy and Run

   - Once imported, click **Deploy**.
   - Open the `uibuilder` URL (e.g., `http://<your-orce-host>:1880/FullstackUI`) to view the user interface.

## Wizard Navigation

   - Start at **Step 1**. Click **Next** to proceed, or any other button to navigate through the wizard.
   - Use the ORCE **Debug** sidebar for monitoring logs and responses from external APIs.


## Flow Breakdown

This flow is divided into logical sections: a **frontend** portion (for UI elements and user interaction) and a **backend** portion (for APIs, logic, decoding, verification, etc.).

![FullAppFlows](images/fullappflow.png)

### Frontend Nodes/Groups

1. **“Welcome to Gaia-X Portal” Group**  
   - **`Label` node**: Displays the primary heading and welcome text.  
   - **`GXUI Header` node**: Provides a Gaia-X style header with navigation links.  
   - **`GXUI Footer` node**: Offers a Gaia-X style footer with quick links and disclaimers.

2. **`Data_Set` Nodes (Steps 1–5)**  
   - Each `Data_Set` node represents a step in the wizard:  
     - **Step 1**: Introduction / “Welcome”  
     - **Step 2**: “Table Data”  
     - **Step 3**: “Decoder”  
     - **Step 4**: “Result”  
     - **Step 5**: “Final Step”

3. **`uibuilder` (“FullstackUI”)**  
   - Serves as the front-end entry point and communicates with the back-end.  
   - All interactions from the UI are passed downstream to the back-end for processing.

4. **Navigation**  
   - A subflow called **`GXUI Navigation`** processes next/previous step logic.  
   - Observes `msg.payload.event.submit` for commands like `goto1stStep`, `goto2ndStep`, etc., then updates the active step.

### Backend Nodes/Groups

1. **HTTP Requests**  
   - Fetch data or credentials from external endpoints.  
   - Includes calls like “Fetch Service Offering,” “Get Credential Offer,” “Generate SD-JWT,” and others.

2. **Logic & Function Nodes**  
   - “Decode Backend,” “Prepare Data,” etc. interpret and manipulate the payloads.  
   - For instance, decoding SD-JWT, verifying credentials, or building request/response payloads.

3. **Link In/Link Out**  
   - Connect various parts of the flow without cluttering the visual layout.

---

## Subflows

1. **`SD JWT UI Decoder`**  
   - Accepts an SD-JWT from the UI.  
   - Calls a global function (`decodeJwt`) to parse it, then returns the result.

2. **`GXUI Navigation`**  
   - Controls wizard navigation by toggling the “active” badge or step.  
   - Ensures consistent UI state management.

3. **`FromBackendAdapter` and `ToBackendAdapter`**  
   - Transform payload structures going to or from the back-end, ensuring consistent data for the UI.

4. **`Create Table`**  
   - Dynamically generates and configures table data for display in the UI (e.g. for Step 2).

---

## Detailed Step-by-Step Explanation

The flow represents a multi-step wizard. Here’s how each step works under the hood:

### Step 1 (Welcome)
- **Front-End**:  
  A `Data_Set` node labeled **“Welcome”**. It introduces the portal’s purpose. Buttons allow navigation to Step 2 or to remain on Step 1.  
- **Back-End**:  
  No major action is triggered except navigation events.

![Step1](images/step1gaia.png)

### Step 2 (Table Data)
- **Front-End**:  
  Displays a dynamic table of service offerings or relevant data. Users can select items if needed.  
- **Back-End**:  
  Possibly triggers a call (e.g. “Fetch SO” or “Get SO Credential”) to retrieve a list of data. The data is processed by subflows (`FromBackendAdapter` or `Create Table`) before appearing in the UI.

![Step2](images/step2gaia.png)

### Step 3 (Decoder)
- **Front-End**:  
  Shows a text area for the user to paste an SD-JWT credential. A **Decode** button triggers a `decode` event.  
- **Back-End**:  
  On decode, the flow calls the **`SD JWT UI Decoder`** subflow or function node using a global `decodeJwt` method. The decoded JSON is returned and displayed in another text area.

![Step3](images/step3gaia.png)

### Step 4 (Result)
- **Front-End**:  
  Shows the decoded credential from Step 3, plus a “Call the API” button.  
- **Back-End**:  
  - When “callapi” is triggered, an HTTP request verifies the SD-JWT or accesses a secured endpoint.  
  - The flow also demonstrates verifying the credential (“Verify SD-JWT”) and invoking a sample “Hello-World” endpoint.  
  - The result of that call is displayed in the UI.

![Step4](images/step4gaia.png)

### Step 5 (Final Step)
- **Front-End**:  
  Prompts the user to upload optional or mandatory certificates.  
- **Back-End**:  
  The user’s input is captured if needed (no external calls unless you configure them).  
- Marks the end of the wizard.

---

## Further Customization

- **Branding**:  
  Change styles in the `GXUI Header`/`GXUI Footer`.
- **Additional Steps**:  
  Insert more `Data_Set` nodes if your workflow is longer or more complex.
- **URL Endpoints**:  
  Modify or extend the HTTP nodes to hit your actual environment endpoints for retrieving or pushing data.
- **SD-JWT**:  
  Tailor the decoding/verification process to meet your security requirements (e.g., custom libraries for `decodeJwt`).

---

## License

This flow is offered under an open source license (e.g., MIT, Apache 2.0, etc.).  
Please verify or update the license terms per your organization’s guidelines.

---

