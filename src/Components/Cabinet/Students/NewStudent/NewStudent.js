import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as routes from "../../../../Constants/routes";
import {
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputBase,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Icons } from "../../../../Assets/Icons/icons";
import {
  AutocompleteField,
  AutocompleteStyled,
  ButtonStyled,
  Main,
  Root,
  TextFieldStyled,
  Title,
  muiTelInputStyles,
  textFieldStyles,
  theme,
} from "../../CabinetStyles";
import Dropzone from "react-dropzone";
import { MuiTelInput } from "mui-tel-input";
import { ruRU } from "@mui/x-date-pickers/locales";
import { ar, ru } from "date-fns/locale";
import _ from "lodash"; // lodash library
import useAutocompleteInput from "../../../../hooks/useAutocompleteHandler";
const russianLocale =
  ruRU.components.MuiLocalizationProvider.defaultProps.localeText;

const headerItemStyles = ({ theme }) => ({
  borderRadius: "10px",
  backgroundColor: "#fff",
  border: "1px solid #E5E7EB",
});

const HeaderDiv = styled("div")(({ theme }) => ({
  borderRadius: "10px",
  backgroundColor: "#fff",
  border: "1px solid #E5E7EB",
}));

const DialogButton = styled(Button)(({ theme, variant, color }) => ({
  minHeight: "44px",
  minWidth: "150px",
  borderRadius: theme.custom.spacing.xxs,
  border:
    variant === "contained" ? `1px solid ${theme.palette[color].main}` : "",
  padding: "10px 30px",
  font: "inherit",
  fontWeight: "400",
  textTransform: "none",
  boxShadow: "none",
  "&:hover": { boxShadow: "none" },
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "none",
}));

const CircleContainer = styled("div")(
  ({ theme, width, height = 160, bgColor = "#fff", active }) => ({
    width: `${width ? width : 160}px`,
    height: `${height}px`,
    backgroundColor: bgColor,
    borderRadius: `${80}px`,
    border: `${active ? "3px dashed #cccccc" : "1px solid #E5E7EB"}`,
    overflow: "hidden",

    "& img": {
      // Set image to cover the entire container
      width: "100%",
      height: "100%",
      objectFit: "cover", // This resizes the image to fit the container

      // Maintain aspect ratio and prevent overflow
      objectPosition: "center", // Center the image within the container
    },

    // animation: `${rainbowCycle} 6s ${
    //   active ? "infinite" : "1"
    // } alternate ease-in-out`,
    // animationDelay: active ? "0s" : "3s", // Control animation timing
  })
);

const FormLabel = styled(Typography)(({ theme, row }) => ({
  padding: "0",
  color: theme.typography.color.darkBlue,
  fontSize: theme.typography.fontSize.xs,
  lineHeight: "normal",
  paddingBottom: row ? "0" : "12px",
  fontWeight: "600",
}));

const RadioStyled = styled(Radio)(({ theme }) => ({
  color: theme.palette.purpleBlue.main,
  "&.Mui-checked": {
    color: theme.palette.purpleBlue.main,
  },
}));

const NewStudent = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // This navigates one step back in history
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstNameHelperText, setFirstNameHelperText] = useState("");
  const [lastNameHelperText, setLastNameHelperText] = useState("");
  const [middleNameHelperText, setMiddleNameHelperText] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [additionalPhoneNumber, setAdditionalPhoneNumber] = useState("");

  const [city, changeCity] = useAutocompleteInput("");
  const [district, changeDistrict] = useAutocompleteInput("");

  const [parentsPhoneNumbers, setParentsPhoneNumbers] = useState([
    { number: "", name: "" },
    { number: "", name: "" },
    { number: "", name: "" },
  ]);
  const [visibleCount, setVisibleCount] = useState(1);

  const [tags, setTags] = useState(["Тег 1", "Тег 2", "Тег 3"]);
  const [tagFormOpen, setTagFormOpen] = useState(false);

  const handleImageSelection = (acceptedFiles) => {
    // Assuming acceptedFiles is an array containing file objects
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]; // Get the first file
      if (file && file.type.startsWith("image/")) {
        // Check if it's an image
        const reader = new FileReader();
        reader.onload = (event) => {
          setSelectedImage(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        console.error("Please upload an image file.");
      }
    }
  };

  const handleUploadClick = () => {
    // Simulate file input click event
    const fileInput = document.getElementById("file-upload-input");
    fileInput.click();
  };

  const handleChange = (event, setter, setHelperText) => {
    const { value } = event.target;
    if (/^[a-zA-Z]*$/.test(value)) {
      setter(value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()); // Capitalize the first letter and make the rest lowercase
      setHelperText("");
    } else {
      setHelperText("Только латинские буквы!");
    }
  };

  const handleChangePhoneNumber = (newPhone, phoneNumberSetter) => {
    // Remove all non-digit characters
    const digits = newPhone.replace(/\D/g, "");

    // Check if the new phone number starts with "+998" and does not exceed 12 digits
    if (newPhone.startsWith("+998") && digits.length <= 12) {
      phoneNumberSetter(newPhone);
    } else if (digits.length <= 3) {
      // If the new phone number is "+99" or "+9", reset it to "+998"
      phoneNumberSetter("+998");
    }
  };

  const handleChangeParentName = useCallback(
    _.debounce((index, name, value) => {
      setParentsPhoneNumbers((values) => {
        const newValues = [...values];
        if (name === "name") {
          newValues[index].name = value;
        }
        return newValues;
      });
    }, 10),
    [parentsPhoneNumbers]
  ); // delay of 10ms

  const handleChangeParentPhoneNumber =
    // useCallback(
    //   _.debounce(
    (index, newPhone) => {
      // Remove all non-digit characters
      const digits = newPhone.replace(/\D/g, "");
      const newValues = [...parentsPhoneNumbers];

      // Check if the new phone number starts with "+998" and does not exceed 12 digits
      if (newPhone.startsWith("+998") && digits.length <= 12) {
        newValues[index].number = newPhone;
        setParentsPhoneNumbers(newValues);
      } else if (digits.length <= 3) {
        // If the new phone number is "+99" or "+9", reset it to "+998"
        newValues[index].number = "+998";
        setParentsPhoneNumbers(newValues);
      }
    };
  //   , 0),
  //   [parentsPhoneNumbers]
  // ); // delay of 10ms

  const handleAddFields = () => {
    setVisibleCount(visibleCount + 1);
  };

  // Function to handle adding a new tag
  const handleAddTag = (tag) => {
    setTags([...tags, tag]);
  };

  // Function to handle deletion of a tag
  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Root>
      <Main>
        <div className="flex items-stretch justify-between">
          <div className="flex items-center gap-md">
            <ButtonStyled
              variant="outlined"
              sx={headerItemStyles}
              color="grey"
              onClick={goBack}
            >
              <Icons.ArrowL />
            </ButtonStyled>
            <div className="flex flex-col">
              <Title>Добавить ученика</Title>
              <div className="flex items-center gap-x3s">
                <Link to={routes.CABINET + routes.STUDENTS} className="link">
                  <Typography fontSize="0.75rem">Ученики</Typography>
                </Link>
                <Icons.ArrowL
                  width="1rem"
                  style={{ transform: "rotate(180deg)" }}
                />
                <Typography fontSize="0.75rem">Добавить ученика</Typography>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-sm">
            <DialogButton
              variant="outlined"
              color="purpleBlue"
              // onClick={handleClickOpen}
            >
              <span>Отменить</span>
            </DialogButton>
            <DialogButton
              variant="contained"
              color="purpleBlue"
              // onClick={handleClickOpen}
            >
              <span>Добавить</span>
            </DialogButton>
          </div>
        </div>
        <div className="flex justify-between gap-md">
          <PaperStyled className="full-width" sx={{ padding: "30px 52px" }}>
            <div className="flex flex-col gap-md">
              <div
                className="flex gap-sm"
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
              >
                <div>
                  <Dropzone onDrop={handleImageSelection}>
                    {({ getRootProps, getInputProps, isDragActive }) => (
                      <CircleContainer
                        className="flex justify-center items-center"
                        active={isDragActive}
                        {...getRootProps()}
                      >
                        <input
                          {...getInputProps({ id: "file-upload-input" })}
                        />
                        {selectedImage ? (
                          <img src={selectedImage} alt="Uploaded" />
                        ) : (
                          <Icons.GalleryAdd />
                        )}
                      </CircleContainer>
                    )}
                  </Dropzone>
                </div>

                <div className="flex flex-col">
                  <div className="full-width full-height">
                    <Title sx={{ fontSize: "1.2rem" }}>Фото профиля</Title>
                    <Typography
                      color="#AEB2BA"
                      fontSize={".8rem"}
                      fontFamily={"Poppins, Rubik, Roboto, sans-serif"}
                    >
                      Мы рекомендуем изображения не менее 1000x1000, вы можете
                      загрузить PNG или JPG размером менее 10 МБ
                    </Typography>
                  </div>
                  <div className="flex gap-xxs">
                    <DialogButton
                      onClick={handleUploadClick}
                      variant="contained"
                      color="purpleBlue"
                    >
                      {selectedImage ? "Изменить" : "Загрузить"}
                    </DialogButton>
                    {selectedImage && (
                      <DialogButton
                        onClick={() => setSelectedImage()}
                        variant="outlined"
                        color="crimson"
                      >
                        Удалить
                      </DialogButton>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Title sx={{ fontSize: "1.2rem" }}>
                  Персональная информация
                </Title>
              </div>
              <div className="flex flex-col gap-md">
                <div>
                  <div className="flex gap-xxs">
                    <FormControl required fullWidth variant="outlined">
                      <label>
                        <FormLabel>Фамилия *</FormLabel>
                      </label>
                      <TextFieldStyled
                        variant="outlined"
                        placeholder="Фамилия"
                        value={lastName}
                        helperText={lastNameHelperText}
                        onChange={(event) =>
                          handleChange(
                            event,
                            setLastName,
                            setLastNameHelperText
                          )
                        }
                      />
                    </FormControl>
                    <FormControl required fullWidth variant="outlined">
                      <label>
                        <FormLabel>Имя *</FormLabel>
                      </label>
                      <TextFieldStyled
                        variant="outlined"
                        placeholder="Имя"
                        value={firstName}
                        helperText={firstNameHelperText}
                        onChange={(event) =>
                          handleChange(
                            event,
                            setFirstName,
                            setFirstNameHelperText
                          )
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth variant="outlined">
                      <label>
                        <FormLabel>Отчество</FormLabel>
                      </label>
                      <TextFieldStyled
                        variant="outlined"
                        placeholder="Отчество"
                        value={middleName}
                        helperText={middleNameHelperText}
                        onChange={(event) =>
                          handleChange(
                            event,
                            setMiddleName,
                            setMiddleNameHelperText
                          )
                        }
                      />
                    </FormControl>
                  </div>
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <label style={{ maxWidth: "25%" }}>
                    <FormLabel row>Номер телефона:</FormLabel>
                  </label>
                  <div
                    className="full-width flex gap-xxs"
                    style={{ maxWidth: "75%" }}
                  >
                    <FormControl fullWidth variant="outlined">
                      <MuiTelInput
                        variant="outlined"
                        defaultCountry="UZ"
                        onlyCountries={["UZ"]}
                        helperText="Основной номер"
                        value={phoneNumber}
                        onChange={(newPhone) =>
                          handleChangePhoneNumber(newPhone, setPhoneNumber)
                        }
                        sx={muiTelInputStyles({ theme })}
                      />
                    </FormControl>
                    <FormControl fullWidth variant="outlined">
                      <MuiTelInput
                        variant="outlined"
                        defaultCountry="UZ"
                        onlyCountries={["UZ"]}
                        helperText="Дополнительный номер"
                        value={additionalPhoneNumber}
                        onChange={(newPhone) =>
                          handleChangePhoneNumber(
                            newPhone,
                            setAdditionalPhoneNumber
                          )
                        }
                        sx={muiTelInputStyles({ theme })}
                      />
                    </FormControl>
                  </div>
                </div>
                <Divider />
                <div>
                  <FormControl>
                    <div className="flex items-center gap-md">
                      <FormLabel id="gender-radios" row>
                        Пол
                      </FormLabel>
                      <RadioGroup
                        row
                        defaultValue="male"
                        aria-labelledby="gender-radios"
                        name="gender-radios"
                        sx={{
                          "& > div": { marginRight: "16px" },
                          "& .MuiFormControlLabel-root": { marginRight: "0" },
                        }}
                      >
                        <div className="flex items-center gap-xxs2">
                          <FormControlLabel
                            value="male"
                            control={<RadioStyled />}
                            label="Мужской"
                          />
                          <Icons.MaleSymbol
                            color={theme.typography.color.purpleBlue}
                          />
                        </div>
                        <div className="flex items-center gap-xxs2">
                          <FormControlLabel
                            value="female"
                            control={<RadioStyled />}
                            label="Женский"
                          />
                          <Icons.FemaleSymbol
                            color={theme.typography.color.purpleBlue}
                          />
                        </div>
                      </RadioGroup>
                    </div>
                  </FormControl>
                </div>
                <Divider />
                <div className="flex gap-lg">
                  <div style={{ maxWidth: "30%" }}>
                    <FormControl fullWidth variant="outlined">
                      <label htmlFor="date-start">
                        <FormLabel>Дата рождения</FormLabel>
                      </label>
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        adapterLocale={ru}
                      >
                        <DatePicker
                          sx={textFieldStyles({ theme })}
                          slots={{
                            openPickerIcon: Icons.CalendarContained,
                          }}
                          slotProps={{
                            field: { clearable: true },
                            openPickerButton: { color: "purpleBlue" },
                          }}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </div>
                  <div>
                    <label>
                      <FormLabel>ID или Свидетельство о рождении</FormLabel>
                    </label>
                    <div className="flex gap-xxs">
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ maxWidth: "25%" }}
                      >
                        <TextFieldStyled
                          variant="outlined"
                          placeholder="Серия"
                        />
                      </FormControl>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ maxWidth: "75%" }}
                      >
                        <TextFieldStyled
                          variant="outlined"
                          placeholder="Номер паспорта"
                        />
                      </FormControl>
                    </div>
                  </div>
                </div>
                <Divider />

                <FormControl fullWidth variant="outlined">
                  <div className="flex flex-col gap-sm">
                    <div className="flex items-center">
                      <label className="full-width" style={{ maxWidth: "25%" }}>
                        <FormLabel row>Адрес проживания</FormLabel>
                      </label>
                      <div
                        className="full-width flex gap-xxs"
                        style={{ maxWidth: "75%" }}
                      >
                        <FormControl fullWidth variant="outlined">
                          <AutocompleteStyled
                            options={["1", "2", "3", "4"]}
                            value={city}
                            onChange={changeCity}
                            renderInput={(params) => (
                              <AutocompleteField
                                {...params}
                                id="city"
                                variant="outlined"
                                placeholder="Город"
                              />
                            )}
                            popupIcon={
                              <Icons.ArrowD
                                color={theme.typography.color.darkBlue}
                              />
                            }
                            clearIcon={
                              <Icons.Delete
                                color={theme.typography.color.darkBlue}
                              />
                            }
                          />
                        </FormControl>
                        <FormControl fullWidth variant="outlined">
                          <AutocompleteStyled
                            options={["1", "2", "3", "4"]}
                            value={district}
                            onChange={changeDistrict}
                            renderInput={(params) => (
                              <AutocompleteField
                                {...params}
                                id="city"
                                variant="outlined"
                                placeholder="Район"
                                helperText={`${
                                  city ? "" : "Сначала выберите город"
                                }`}
                                // error={!city}
                              />
                            )}
                            disabled={!city}
                            popupIcon={
                              <Icons.ArrowD
                                color={theme.typography.color.darkBlue}
                              />
                            }
                            clearIcon={
                              <Icons.Delete
                                color={theme.typography.color.darkBlue}
                              />
                            }
                          />
                        </FormControl>
                      </div>
                    </div>

                    {/* <div className="flex gap-xxs" style={{ marginLeft: "25%" }}> */}
                    <TextFieldStyled
                      fullWidth
                      variant="outlined"
                      placeholder="Место проживания"
                      sx={{ marginLeft: "25%", maxWidth: "75%" }}
                    />
                    {/* </div> */}
                  </div>
                </FormControl>
              </div>
            </div>
          </PaperStyled>
          <PaperStyled className="full-width" sx={{ padding: "30px 52px" }}>
            <div className="flex flex-col gap-md">
              <FormControl fullWidth variant="outlined">
                <div className="flex items-center justify-between">
                  <label style={{ maxWidth: "25%" }}>
                    <FormLabel row>E-mail</FormLabel>
                  </label>
                  <TextFieldStyled
                    fullWidth
                    variant="outlined"
                    placeholder="info@gmail.com"
                    sx={{ maxWidth: "75%" }}
                  />
                </div>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <div className="flex items-center justify-between">
                  <label style={{ maxWidth: "25%" }}>
                    <FormLabel row>ID/Номер договора</FormLabel>
                  </label>
                  <TextFieldStyled
                    fullWidth
                    variant="outlined"
                    placeholder="Пример: 011/256"
                    sx={{ maxWidth: "75%" }}
                  />
                </div>
              </FormControl>
              <div className="full-width flex flex-col gap-xs">
                {/* Render the first item */}
                {parentsPhoneNumbers[0] && (
                  <div className="flex items-center justify-between">
                    <label style={{ maxWidth: "25%" }}>
                      <FormLabel row>Телефон родителей</FormLabel>
                    </label>
                    <div
                      className="full-width flex gap-xxs"
                      style={{ maxWidth: "75%" }}
                    >
                      <FormControl fullWidth variant="outlined">
                        <MuiTelInput
                          variant="outlined"
                          defaultCountry="UZ"
                          onlyCountries={["UZ"]}
                          value={parentsPhoneNumbers[0].number}
                          onChange={(newPhone) =>
                            handleChangeParentPhoneNumber(0, newPhone)
                          }
                          sx={muiTelInputStyles({ theme })}
                        />
                      </FormControl>
                      <FormControl fullWidth variant="outlined">
                        <TextFieldStyled
                          variant="outlined"
                          placeholder="Имя"
                          name="name"
                          value={parentsPhoneNumbers[0].name}
                          onChange={(event) =>
                            handleChangeParentName(
                              0,
                              event.target.name,
                              event.target.value
                            )
                          }
                        />
                      </FormControl>
                    </div>
                  </div>
                )}

                {/* Render the rest of the items */}
                {parentsPhoneNumbers
                  .slice(1, visibleCount)
                  .map((parentPhoneNumber, index) => (
                    <div
                      className="full-width flex gap-xxs"
                      style={{ marginLeft: "25%", maxWidth: "75%" }}
                    >
                      <FormControl fullWidth variant="outlined">
                        <MuiTelInput
                          variant="outlined"
                          defaultCountry="UZ"
                          onlyCountries={["UZ"]}
                          value={parentPhoneNumber.number}
                          onChange={(newPhone) =>
                            handleChangeParentPhoneNumber(index + 1, newPhone)
                          }
                          sx={muiTelInputStyles({ theme })}
                        />
                      </FormControl>
                      <FormControl fullWidth variant="outlined">
                        <TextFieldStyled
                          variant="outlined"
                          placeholder="Имя"
                          name="name"
                          value={parentPhoneNumber.name}
                          onChange={(event) =>
                            handleChangeParentName(
                              index + 1,
                              event.target.name,
                              event.target.value
                            )
                          }
                        />
                      </FormControl>
                    </div>
                  ))}

                <div style={{ marginLeft: "25%", maxWidth: "75%" }}>
                  <DialogButton
                    variant="outlined"
                    color="purpleBlue"
                    onClick={handleAddFields}
                    disabled={visibleCount >= parentsPhoneNumbers.length}
                  >
                    Добавить ещё
                  </DialogButton>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label style={{ maxWidth: "25%" }}>
                  <FormLabel row>Добавить тег:</FormLabel>
                </label>
                <div
                  className="full-width flex flex-wrap gap-x3s"
                  style={{ maxWidth: "75%" }}
                >
                  {tags.map((tag, i) => (
                    <Chip
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      key={i}
                      variant="outlined"
                      color="purpleBlue"
                      sx={{
                        borderRadius: "8px",
                      }}
                      deleteIcon={
                        <Icons.Delete color={theme.typography.color.darkBlue} />
                      }
                    />
                  ))}
                  {tagFormOpen && (
                    <FormControl variant="outlined">
                      <TextField
                        autoFocus
                        required
                        onBlur={() => {
                          setTagFormOpen(!tagFormOpen);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            setTagFormOpen(false);
                            handleAddTag(e.target.value);
                          }
                        }}
                        id="info"
                        variant="outlined"
                        sx={{
                          fontSize: theme.typography.fontSize.xs,
                          fontWeight: "400",
                          color: "inherit",
                          "& .MuiInputBase-root": {
                            borderRadius: "8px",
                            ".MuiInputBase-input": {
                              width: "100px",
                              padding: "4.5px 12px",
                              "::placeholder": {
                                color: "#D1D5DB",
                                opacity: "1",
                              },
                            },
                            ".MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline, &:focus .MuiOutlinedInput-notchedOutline":
                              {
                                border: "1px solid #E5E7EB !important",
                                boxShadow:
                                  "0px 1px 2px 0px rgba(31, 41, 55, 0.08) !important",
                              },
                          },
                          "& .MuiFormHelperText-root": {
                            color: "crimson",
                            fontSize: ".8rem",
                            margin: "2px 0 -10px 12px",
                          },
                        }}
                      />
                    </FormControl>
                  )}
                  <Chip
                    label="+"
                    variant="outlined"
                    color="purpleBlue"
                    sx={{
                      borderRadius: `${theme.custom.spacing.xxs}px`,
                    }}
                    onClick={() => setTagFormOpen(!tagFormOpen)}
                  />
                </div>
              </div>
              <FormControl fullWidth variant="outlined">
                <div className="flex items-start justify-between">
                  <label style={{ maxWidth: "25%" }}>
                    <FormLabel row>Описание</FormLabel>
                  </label>
                  <TextFieldStyled
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    placeholder="Описание ученика"
                    sx={{
                      maxWidth: "75%",
                      "& .MuiInputBase-multiline": {
                        padding: "0",
                      },
                    }}
                  />
                </div>
              </FormControl>
            </div>
          </PaperStyled>
        </div>
      </Main>
    </Root>
  );
};

export default NewStudent;
