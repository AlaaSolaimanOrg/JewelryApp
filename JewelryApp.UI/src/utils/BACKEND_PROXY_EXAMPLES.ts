/**
 * DYMO Backend Proxy Setup Guide
 *
 * This file provides example implementations for proxying DYMO Connect requests
 * through your backend to solve CORS issues in production.
 */

// ============================================
// C# / ASP.NET Core Implementation
// ============================================

/*
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;

namespace YourNamespace.Controllers
{
    /// <summary>
    /// Proxy controller for DYMO Connect API requests
    /// Prevents CORS errors by routing DYMO requests through the backend
    /// </summary>
    [ApiController]
    [Route("api/dymo")]
    public class DymoProxyController : ControllerBase
    {
        private static readonly HttpClientHandler _httpHandler = new HttpClientHandler
        {
            // Required for localhost HTTPS connections
            ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
        };

        private static readonly HttpClient _httpClient = new HttpClient(_httpHandler);
        private const string DymoBaseUrl = "https://127.0.0.1:41951";

        [HttpGet("status")]
        public async Task<IActionResult> GetStatus()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{DymoBaseUrl}/DYMO/DLS/Printing/StatusConnected");
                var content = await response.Content.ReadAsStringAsync();
                
                return Ok(new
                {
                    success = response.IsSuccessStatusCode,
                    data = content,
                    statusCode = response.StatusCode
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    error = ex.Message,
                    details = "Failed to connect to DYMO Connect service. Ensure it's running on this machine."
                });
            }
        }

        [HttpPost("printers")]
        public async Task<IActionResult> GetPrinters()
        {
            try
            {
                var response = await _httpClient.PostAsync(
                    $"{DymoBaseUrl}/DYMO/DLS/Printers",
                    new StringContent("", System.Text.Encoding.UTF8, "application/json")
                );
                
                var content = await response.Content.ReadAsStringAsync();
                return Ok(new
                {
                    success = response.IsSuccessStatusCode,
                    printers = content
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    error = ex.Message
                });
            }
        }

        [HttpPost("print")]
        public async Task<IActionResult> Print([FromBody] DymoPrintRequest request)
        {
            try
            {
                var httpContent = new StringContent(
                    request.Data,
                    System.Text.Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PostAsync(
                    $"{DymoBaseUrl}/DYMO/DLS/Printing/Print",
                    httpContent
                );

                var content = await response.Content.ReadAsStringAsync();
                return Ok(new
                {
                    success = response.IsSuccessStatusCode,
                    response = content
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    error = ex.Message
                });
            }
        }
    }

    public class DymoPrintRequest
    {
        public string Data { get; set; }
        public string PrinterName { get; set; }
    }
}
*/

// ============================================
// Node.js / Express Implementation
// ============================================

/*
import express from 'express';
import https from 'https';
import http from 'http';

const router = express.Router();
const DYMO_BASE_URL = 'https://127.0.0.1:41951';

// Middleware to disable SSL verification for localhost
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// GET DYMO Status
router.get('/status', async (req, res) => {
  try {
    const response = await fetch(
      `${DYMO_BASE_URL}/DYMO/DLS/Printing/StatusConnected`,
      {
        method: 'GET',
        agent: httpsAgent,
      }
    );

    const data = await response.json();
    res.json({
      success: response.ok,
      data,
      statusCode: response.status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to connect to DYMO Connect service',
    });
  }
});

// GET Printers
router.post('/printers', async (req, res) => {
  try {
    const response = await fetch(`${DYMO_BASE_URL}/DYMO/DLS/Printers`, {
      method: 'POST',
      agent: httpsAgent,
    });

    const data = await response.json();
    res.json({
      success: response.ok,
      printers: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST Print
router.post('/print', async (req, res) => {
  try {
    const { data, printerName } = req.body;

    const response = await fetch(`${DYMO_BASE_URL}/DYMO/DLS/Printing/Print`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        printerName,
        data,
      }),
      agent: httpsAgent,
    });

    const responseData = await response.json();
    res.json({
      success: response.ok,
      response: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
*/

// ============================================
// Python / Flask Implementation
// ============================================

/*
from flask import Blueprint, jsonify, request
import requests
from urllib3.exceptions import InsecureRequestWarning

# Suppress SSL warnings for localhost
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

dymo_bp = Blueprint('dymo', __name__, url_prefix='/api/dymo')
DYMO_BASE_URL = 'https://127.0.0.1:41951'

@dymo_bp.route('/status', methods=['GET'])
def get_status():
    try:
        response = requests.get(
            f'{DYMO_BASE_URL}/DYMO/DLS/Printing/StatusConnected',
            verify=False,
            timeout=5
        )
        return jsonify({
            'success': response.status_code == 200,
            'data': response.json(),
            'statusCode': response.status_code
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'details': 'Failed to connect to DYMO Connect service'
        }), 500

@dymo_bp.route('/printers', methods=['POST'])
def get_printers():
    try:
        response = requests.post(
            f'{DYMO_BASE_URL}/DYMO/DLS/Printers',
            verify=False,
            timeout=5
        )
        return jsonify({
            'success': response.status_code == 200,
            'printers': response.json()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@dymo_bp.route('/print', methods=['POST'])
def print_label():
    try:
        data = request.json
        response = requests.post(
            f'{DYMO_BASE_URL}/DYMO/DLS/Printing/Print',
            json=data,
            verify=False,
            timeout=10
        )
        return jsonify({
            'success': response.status_code == 200,
            'response': response.json()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
*/

export {};
