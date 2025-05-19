package ksco.software.SPDF.service.misc;

import java.io.IOException;

import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

import ksco.software.SPDF.Factories.ReplaceAndInvertColorFactory;
import ksco.software.SPDF.model.api.misc.HighContrastColorCombination;
import ksco.software.SPDF.model.api.misc.ReplaceAndInvert;
import ksco.software.SPDF.utils.misc.ReplaceAndInvertColorStrategy;

@Service
@RequiredArgsConstructor
public class ReplaceAndInvertColorService {
    private final ReplaceAndInvertColorFactory replaceAndInvertColorFactory;

    public InputStreamResource replaceAndInvertColor(
            MultipartFile file,
            ReplaceAndInvert replaceAndInvertOption,
            HighContrastColorCombination highContrastColorCombination,
            String backGroundColor,
            String textColor)
            throws IOException {

        ReplaceAndInvertColorStrategy replaceColorStrategy =
                replaceAndInvertColorFactory.replaceAndInvert(
                        file,
                        replaceAndInvertOption,
                        highContrastColorCombination,
                        backGroundColor,
                        textColor);

        return replaceColorStrategy.replace();
    }
}
