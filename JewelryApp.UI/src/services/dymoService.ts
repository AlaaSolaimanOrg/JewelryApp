// src/services/dymoService.ts
interface DymoPrinter {
  name: string;
  isConnected: boolean;
  isLocal: boolean;
  printerType: string;
}

interface DymoStatus {
  isInstalled: boolean;
  isSupported: boolean;
  isInitialized: boolean;
  version: string;
  printers: DymoPrinter[];
}

class DymoService {
  private static instance: DymoService;
  private dymo: any = null;
  private status: DymoStatus = {
    isInstalled: false,
    isSupported: false,
    isInitialized: false,
    version: '',
    printers: []
  };

  static getInstance(): DymoService {
    if (!DymoService.instance) {
      DymoService.instance = new DymoService();
    }
    return DymoService.instance;
  }

  // Load DYMO script dynamically
  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if ((window as any).dymo) {
        this.dymo = (window as any).dymo;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = '/DYMO/DLS/JavaScript/dymo.connect.framework.js';
      script.onload = () => {
        // Wait for DYMO object to be available
        const checkInterval = setInterval(() => {
          if ((window as any).dymo) {
            this.dymo = (window as any).dymo;
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('DYMO object not found after loading script'));
        }, 5000);
      };
      
      script.onerror = () => reject(new Error('Failed to load DYMO script'));
      document.head.appendChild(script);
    });
  }

  async initialize(): Promise<DymoStatus> {
    try {
      // Load the script
      await this.loadScript();
      
      // Check environment
      const env = this.dymo.label.framework.checkEnvironment();
      this.status.isInstalled = env.isFrameworkInstalled;
      this.status.isSupported = env.isBrowserSupported;
      this.status.version = this.dymo.label.framework.VERSION || 'Unknown';
      
      // Initialize framework
      if (this.status.isInstalled && this.status.isSupported) {
        await this.dymo.label.framework.init();
        this.status.isInitialized = true;
        
        // Get printers
        this.status.printers = this.dymo.label.framework.getPrinters() || [];
      }
      
      return this.status;
    } catch (error) {
      console.error('DYMO initialization error:', error);
      throw error;
    }
  }

  getStatus(): DymoStatus {
    return { ...this.status };
  }

  async getPrinters(): Promise<DymoPrinter[]> {
    if (!this.status.isInitialized) {
      await this.initialize();
    }
    return this.dymo.label.framework.getPrinters();
  }

  async print(labelXml: string, printerName: string, copies: number = 1): Promise<void> {
    if (!this.status.isInitialized) {
      await this.initialize();
    }

    const label = this.dymo.label.framework.openLabelXml(labelXml);
    
    // For multiple copies, use printAndPollStatus
    if (copies > 1) {
      // Create label set XML for multiple copies
      let labelSetXml = '<?xml version="1.0" encoding="utf-8"?>';
      labelSetXml += '<LabelSet>';
      for (let i = 0; i < copies; i++) {
        labelSetXml += `<Label><ObjectData></ObjectData></Label>`;
      }
      labelSetXml += '</LabelSet>';
      
      await label.printAndPollStatus(printerName, '', labelSetXml);
    } else {
      label.print(printerName);
    }
  }

  // Helper to create label XML
  createLabelXml(fields: Record<string, string>): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<DieCutLabel Version="8.0" Units="twips">
  <PaperOrientation>Landscape</PaperOrientation>
  <Id>Address</Id>
  <PaperName>30252 Address</PaperName>
  <DrawCommands>
    <RoundRectangle X="0" Y="0" Width="1440" Height="1440" Rx="270" Ry="270"/>
  </DrawCommands>
  <ObjectInfo>
    ${Object.entries(fields).map(([name, value]) => `
    <TextObject>
      <Name>${name}</Name>
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>
      <LinkedObjectName></LinkedObjectName>
      <Rotation>Rotation0</Rotation>
      <IsMirrored>False</IsMirrored>
      <IsVariable>True</IsVariable>
      <HorizontalAlignment>Center</HorizontalAlignment>
      <VerticalAlignment>Middle</VerticalAlignment>
      <TextFitMode>ShrinkToFit</TextFitMode>
      <UseFullFontHeight>True</UseFullFontHeight>
      <Verticalized>False</Verticalized>
      <StyledText>
        <Element>
          <String>${value}</String>
          <Attributes>
            <Font Family="Arial" Size="12" Bold="True"/>
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
          </Attributes>
        </Element>
      </StyledText>
    </TextObject>
    `).join('')}
  </ObjectInfo>
</DieCutLabel>`;
  }
}

export const dymoService = DymoService.getInstance();