import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  useTheme,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { useState } from "react";
import HelpIcon from "@mui/icons-material/HelpOutlineRounded";
import ExpandIcon from "@mui/icons-material/ExpandMoreRounded";
import PlayIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import SchemaIcon from "@mui/icons-material/SchemaRounded";
import QrCodeIcon from "@mui/icons-material/QrCodeRounded";
import AddChartIcon from "@mui/icons-material/AddchartRounded";
import DashboardIcon from "@mui/icons-material/DashboardRounded";
import ArchiveIcon from "@mui/icons-material/ArchiveRounded";
import PageHeader from "../ui/PageHeader";

// Video tutorial card component
function VideoTutorial({
  title,
  description,
  duration,
  thumbnailColor,
  onClick,
}: {
  title: string;
  description: string;
  duration?: string;
  thumbnailColor: string;
  onClick: () => void;
}) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        border: `2px solid ${theme.palette.divider}`,
        borderRadius: 3,
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 4px 12px ${theme.palette.primary.main}15`,
          transform: "translateY(-2px)",
        },
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          width: "100%",
          paddingTop: "56.25%",
          position: "relative",
          background: `linear-gradient(135deg, ${thumbnailColor}40 0%, ${thumbnailColor}20 100%)`,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PlayIcon
            sx={{
              fontSize: 64,
              color: theme.palette.primary.main,
              opacity: 0.8,
            }}
          />
        </Box>
        {duration && (
          <Chip
            label={duration}
            size="small"
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              fontWeight: 600,
            }}
          />
        )}
      </Box>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

interface ContentSection {
  subtitle?: string;
  text?: string;
  steps?: string[];
}

interface TutorialSection {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  content: ContentSection[];
}

export default function Help() {
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = useState<number | false>(0);

  const handleAccordionChange =
    (panel: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedSection(isExpanded ? panel : false);
    };

  // Tutorial sections data structure
  const tutorialSections: TutorialSection[] = [
    {
      id: 0,
      title: "Getting Started",
      icon: <HelpIcon />,
      color: theme.palette.primary.main,
      content: [
        {
          subtitle: "Welcome to FarmHand!",
          text: "FarmHand is designed to make FRC scouting simple and accessible for teams of any experience level. This guide will help you get started with the basics.",
        },
        {
          subtitle: "First Time Setup",
          steps: [
            "Open the Settings page from the navigation menu",
            "Set your Device ID (1-6 for scouting devices)",
            "If device will only be used to collect and export data, check the: 'Lead scout only' switch",
            "Select your scouting schema (e.g., '2025 Reefscape')",
            "Configure the total number of scout devices your team is using",
          ],
        },
        {
          subtitle: "Key Concepts",
          text: "• Schema: The form layout defining what data you collect\n• QR Codes: How match data transfers between devices\n• Device ID: Identifies which scout recorded each match\n• Archive: Long-term storage for completed match data",
        },
      ],
    },
    {
      id: 1,
      title: "Scouting a Match",
      icon: <AddChartIcon />,
      color: theme.palette.secondary.main,
      content: [
        {
          subtitle: "Recording Match Data",
          steps: [
            "Navigate to the Scout page from the home screen",
            "Fill in the Match Number and Team Number first",
            "Complete each section of the form in order",
            "Use the expand/collapse buttons to navigate sections",
            "Required fields are marked with an asterisk (*)",
          ],
        },
        {
          subtitle: "Field Types",
          text: "• Counter: Add/subtract values with + and - buttons\n• Checkbox: Toggle yes/no or true/false values\n• Dropdown: Select from predefined options\n• Text: Enter custom notes or descriptions\n• Timer: Track time for specific actions\n• Grid: Mark positions on a field layout",
        },
        {
          subtitle: "Completing Your Scout",
          steps: [
            "Review all sections for completeness",
            "Click 'Complete Scout' to generate a QR code",
            "Save the QR code to your device's match history",
            "The form will reset for the next match",
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Working with QR Codes",
      icon: <QrCodeIcon />,
      color: theme.palette.info.main,
      content: [
        {
          subtitle: "Viewing Your QR Codes",
          text: "All saved match data appears as QR codes in the QR Codes page. Each code contains the complete data for one match, compressed for easy sharing.",
        },
        {
          subtitle: "Scanning QR Codes",
          steps: [
            "Click the 'Scan' button on the QR Codes page",
            "Point your camera at another device's QR code",
            "Multiple codes can be scanned in one session",
            "Click 'Import All' to add them to your collection",
          ],
        },
        {
          subtitle: "Managing QR Codes",
          text: "• Filter: Search by match number, team number, or date\n• Sort: Organize by match number or most recent\n• Select Mode: Choose multiple codes for bulk actions\n• Export: Save selected codes as CSV or JSON files\n• Archive: Move old codes to long-term storage",
        },
        {
          subtitle: "Sharing QR Codes",
          steps: [
            "Tap any QR code to open the detail view",
            "Use 'Download' to save the image to your device",
            "Other scouts can scan the QR from your screen",
            "Or share the downloaded image via any method",
          ],
        },
      ],
    },
    {
      id: 3,
      title: "Lead Scout Dashboard",
      icon: <DashboardIcon />,
      color: theme.palette.success.main,
      content: [
        {
          subtitle: "Dashboard Overview",
          text: "The Lead Scout Dashboard helps track which matches have been scouted across all devices. It shows completion status and identifies missing data.",
        },
        {
          subtitle: "Understanding the Dashboard",
          text: "• Complete Matches: All scouts have submitted data\n• Incomplete Matches: Some scouts are missing\n• Completion Rate: Overall progress percentage\n• Device Status: Which device ID scouted each match",
        },
        {
          subtitle: "Lead Scout Mode",
          steps: [
            "Enable 'Lead Scout Only' in Settings",
            "This sets your Device ID to 0 automatically",
            "Your data won't count toward scout metrics",
            "Use this for collecting QR codes from other scouts",
          ],
        },
        {
          subtitle: "Best Practices",
          text: "• Check the dashboard before each match\n• Follow up with scouts who are behind\n• Export data regularly as backup\n• Use Archive to clear old event data",
        },
      ],
    },
    {
      id: 4,
      title: "Schemas & Customization",
      icon: <SchemaIcon />,
      color: theme.palette.warning.main,
      content: [
        {
          subtitle: "What is a Schema?",
          text: "A schema defines the structure of your scouting form - what fields to collect and how they're organized. FarmHand includes built-in schemas for each season, or you can create custom ones.",
        },
        {
          subtitle: "Using Built-in Schemas",
          steps: [
            "Go to Settings and click 'Open Schema Editor'",
            "View available built-in schemas (marked 'Built-in')",
            "Select a schema to see its sections and fields",
            "Built-in schemas cannot be edited to prevent errors",
          ],
        },
        {
          subtitle: "Creating Custom Schemas",
          steps: [
            "Click 'Create New Schema' and name it",
            "Add sections to organize related fields",
            "Add fields within each section",
            "Configure field types and properties",
            "Save and set as your active schema in Settings",
          ],
        },
        {
          subtitle: "Schema Sharing",
          text: "Custom schemas can be shared between devices using QR codes, just like match data. This ensures your entire team uses the same form structure.",
        },
        {
          subtitle: "Important Notes",
          text: "⚠️ Changing schemas mid-event will make old match data incompatible\n⚠️ Always coordinate schema changes with your lead scout\n⚠️ Export your data before switching schemas",
        },
      ],
    },
    {
      id: 5,
      title: "Archive & Data Management",
      icon: <ArchiveIcon />,
      color: theme.palette.error.main,
      content: [
        {
          subtitle: "Using the Archive",
          text: "The Archive stores QR codes you no longer need for active scouting but want to keep for later analysis or reference.",
        },
        {
          subtitle: "Archiving QR Codes",
          steps: [
            "Go to the QR Codes page",
            "Use Select mode to choose codes to archive",
            "Click 'Send to Archive' at the bottom",
            "Archived codes appear in the Archive page",
          ],
        },
        {
          subtitle: "Managing Archived Data",
          text: "• View: Browse all archived QR codes\n• Unarchive: Move codes back to active QR list\n• Delete: Permanently remove codes (cannot be undone)\n",
        },
        {
          subtitle: "When to Archive",
          text: "• After exporting match data for analysis\n• At the end of an event or competition\n• When cleaning up old practice matches\n• Before starting a new event or season",
        },
      ],
    },
  ];

  // Video tutorials data
  const videoTutorials = [
    {
      title: "Quick Start Guide",
      description: "Get up and running with FarmHand in under 5 minutes",
      duration: "4:30",
      thumbnailColor: theme.palette.primary.main,
    },
    {
      title: "Scouting Your First Match",
      description: "Complete walkthrough of the scouting process",
      duration: "6:15",
      thumbnailColor: theme.palette.secondary.main,
    },
    {
      title: "QR Code Workflow",
      description: "How to scan, share, and manage QR codes",
      duration: "5:45",
      thumbnailColor: theme.palette.info.main,
    },
    {
      title: "Creating Custom Schemas",
      description: "Build a custom scouting form for your team",
      duration: "8:20",
      thumbnailColor: theme.palette.warning.main,
    },
  ];

  const handleVideoClick = (title: string) => {
    // TODO: Replace with actual video player implementation
    // Could be a dialog with an embedded video player
    console.log(`Opening video: ${title}`);
    alert(
      `Video player would open: ${title}\n\nReplace this with an actual video implementation.`
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        icon={<HelpIcon sx={{ fontSize: 28 }} />}
        title="Help & Tutorials"
        subtitle="Learn how to use FarmHand effectively"
      />

      {/* Video Tutorials Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>
          Video Tutorials
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {videoTutorials.map((video, index) => (
            <VideoTutorial
              key={index}
              {...video}
              onClick={() => handleVideoClick(video.title)}
            />
          ))}
        </Box>
      </Box>

      {/* Instructional Sections */}
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>
          Step-by-Step Guides
        </Typography>
        <Stack spacing={2}>
          {tutorialSections.map((section) => (
            <Accordion
              key={section.id}
              expanded={expandedSection === section.id}
              onChange={handleAccordionChange(section.id)}
              elevation={0}
              sx={{
                border: `2px solid ${
                  expandedSection === section.id
                    ? section.color
                    : theme.palette.divider
                }`,
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:before": {
                  display: "none",
                },
                "&:hover": {
                  borderColor: section.color,
                  boxShadow: `0 4px 12px ${section.color}20`,
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandIcon
                    sx={{
                      color: section.color,
                      fontSize: 28,
                    }}
                  />
                }
                sx={{
                  backgroundColor:
                    expandedSection === section.id
                      ? `${section.color}10`
                      : "transparent",
                  borderRadius:
                    expandedSection === section.id ? "12px 12px 0 0" : 3,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: `${section.color}20`,
                      color: section.color,
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {section.title}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  {section.content.map((item, index) => (
                    <Box key={index}>
                      {item.subtitle && (
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          {item.subtitle}
                        </Typography>
                      )}
                      {item.text && (
                        <Typography
                          variant="body1"
                          sx={{ whiteSpace: "pre-line" }}
                        >
                          {item.text}
                        </Typography>
                      )}
                      {item.steps && (
                        <Box component="ol" sx={{ pl: 2 }}>
                          {item.steps.map((step, stepIndex) => (
                            <Typography
                              key={stepIndex}
                              component="li"
                              variant="body1"
                              sx={{ mb: 1 }}
                            >
                              {step}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
